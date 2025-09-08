# Sanity CMS → Next.js Flow (Innstastay)

This document explains exactly how Sanity connects to this Next.js project, how changes publish and preview, common failure modes, and how to fix them. All references cite files and line ranges from this repo.

## 1) Connection Overview

- **Sanity clients**
  - Public client for app data access: `sanity/lib/client.ts` (imported by `lib/cms/page.ts:L1`).
  - Alternate client used by admin/services: `lib/sanity.ts:L4–L10` (projectId enforced via env `lib/sanity.ts:L5`).
  - Next-sanity client (not the primary fetcher for pages): `lib/sanity.client.ts:L3–L8`.
- **Dataset / Tokens / Project**
  - ProjectId: `process.env.NEXT_PUBLIC_SANITY_PROJECT_ID` (required) `lib/sanity.ts:L5`.
  - Dataset: `'production'` for site runtime `lib/sanity.ts:L6`; Studio also uses production `sanity/env.ts:L3–L5`, referenced in `sanity.config.ts:L18–L20`.
  - Token (server-side for drafts/mutations): `process.env.SANITY_API_TOKEN` (used for preview drafts) `lib/cms/page.ts:L36`.
- **Pages using CMS data**
  - Home: `app/page.tsx` (generateMetadata L12–L36; render L38–L53)
  - About: `app/about/page.tsx` (L8–L32, L34–L45)
  - Contact: `app/contact/page.tsx` (L8–L32, L34–L45)
  - Downtown: `app/hotels/toronto-downtown/page.tsx` (L8–L30, L32–L42)
- **GROQ queries**
  - Page by slug + expanded sections: `lib/cms/page.ts:L11–L30`.
  - Draft-aware fetch with fallback to preview drafts: `lib/cms/page.ts:L31–L45`.
  - All page slugs for sitemap: `lib/cms/page.ts:L47–L50`.
- **Preview mode (draftMode)**
  - Entry point: `app/api/preview/route.ts:L3–L10` (checks `SANITY_PREVIEW_SECRET`, enables `draftMode()`, redirects to slug).
  - Pages pass `draftMode().isEnabled` to `getPageBySlug(...)` (e.g., `app/about/page.tsx:L38–L43`).

### Single Client Contract (recommended)

Use one canonical client factory and re-export everywhere to prevent drift. Example contract the codebase should adopt:

```ts
// lib/cms/sanityClient.ts
import { createClient } from 'next-sanity'
import { draftMode } from 'next/headers'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
const apiVersion = '2023-10-01'

export function getClient() {
  const preview = draftMode().isEnabled
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false, // deterministic
    ...(preview
      ? { token: process.env.SANITY_API_TOKEN, perspective: 'previewDrafts' as any }
      : { perspective: 'published' as any }),
  })
}
```

Then update loaders to `const client = getClient()` and remove ad‑hoc client configs.

## 2) Publishing Path (Editor → Site)

1) Editor publishes in Sanity Studio (`/studio`).
2) Revalidation triggered (webhook or manual):
   - `app/api/revalidate/route.ts` verifies `x-revalidate-secret` vs `REVALIDATE_SECRET` (L5–L8), reads `paths[]` (L9–L12), calls `revalidatePath()` (L11).
3) Next.js ISR/cache invalidated → subsequent requests render updated CMS content.
4) Redirects cache flush if needed: `app/api/redirects/route.ts:L3–L9` (also gated by `REVALIDATE_SECRET`).

Required env for publishing:
- `NEXT_PUBLIC_SANITY_PROJECT_ID` (lib/sanity.ts:L5)
- `NEXT_PUBLIC_SANITY_DATASET` (e.g., admin API `app/api/admin/hotels/import/route.ts:L7`)
- `SANITY_API_TOKEN` (lib/cms/page.ts:L36)
- `REVALIDATE_SECRET` (app/api/revalidate/route.ts:L5–L8)
- `SANITY_PREVIEW_SECRET` (app/api/preview/route.ts:L7)

## 3) Preview Path (Drafts)

- Enter preview: `/api/preview?secret=SANITY_PREVIEW_SECRET&slug=home` (app/api/preview/route.ts:L3–L10).
- When `draftMode` is enabled, pages pass `{ drafts: true }` so `lib/cms/page.ts` falls back to tokened `previewDrafts` if published is missing (L31–L45).
- Caching: preview fallback uses `useCdn: false` internally (L39). Home also sets ISR (`dynamic = "force-static"; revalidate = 3600` in `app/page.tsx:L9–L10`).

### Preview caching guardrails (make explicit)

When `draftMode().isEnabled === true`, fetches must not rely on ISR. Add `export const revalidate = 0` (or `cache: 'no-store'` on fetch calls) on pages that read drafts:
- `app/page.tsx` (home)
- `app/about/page.tsx`
- `app/contact/page.tsx`
- `app/hotels/toronto-downtown/page.tsx`

If keeping ISR on the route (e.g., home), ensure the draft fallback query uses a non‑CDN client as implemented in `lib/cms/page.ts:L36–L44`.

## 4) Failure Modes (Top 5)

1) Missing/incorrect env vars
   - Files: `app/api/preview/route.ts:L7`, `app/api/revalidate/route.ts:L5–L8`, `lib/sanity.ts:L5`, `lib/cms/page.ts:L36–L40`.
2) Hardcoded projectId fallback
   - Previously a fallback; now enforced env `lib/sanity.ts:L5`. Missing env will fail build/runtime (expected).
3) Webhooks not configured
   - Publishing doesn’t reflect; configure Manage → `/api/revalidate` with `x-revalidate-secret`.
4) Revalidate secret mismatch
   - `app/api/revalidate/route.ts:L5–L8` → ensure header name and value match.
5) Preview fetch not using drafts
   - If `SANITY_API_TOKEN` missing/insufficient, `previewDrafts` path in `lib/cms/page.ts:L36–L44` won’t return drafts.

## 5) Required Setup

### .env.example (validated)
```env
# Feature flag for CMS-rendered pages
USE_CMS_PAGES=true

# Revalidation / Preview
REVALIDATE_SECRET=your-long-random-string
SANITY_PREVIEW_SECRET=your-preview-secret

# Sanity (public)
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production

# Sanity (server)
SANITY_API_TOKEN=your_editor_token

# Pricing / SerpApi
SERPAPI_KEY=your_serpapi_key
PRICE_DEBUG=0
PRICE_WRITE_FILES=0

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Sanity Manage → Webhooks
- Revalidate pages/navigation/settings/fragments
  - URL: `https://YOUR_SITE_DOMAIN/api/revalidate`
  - Method: POST
  - Header: `x-revalidate-secret: REVALIDATE_SECRET`
  - Trigger: publish/unpublish for `page`, `navigation`, `siteSettings`, `fragment`
  - Payload (preferred, tag‑aware):
    ```json
    { "paths": ["/about"], "tags": ["navigation", "settings", "page:about"] }
    ```
    Server behavior: if `tags` are present → call `revalidateTag(tag)` for each; else fallback to `revalidatePath(path)`.
- Flush redirects
  - URL: `https://YOUR_SITE_DOMAIN/api/redirects`
  - Method: POST
  - Header: `x-revalidate-secret: REVALIDATE_SECRET`

### Testing
- Revalidate
```bash
curl -i -X POST \
  -H "x-revalidate-secret: $REVALIDATE_SECRET" \
  -H "content-type: application/json" \
  -d '{"paths":["/","/about"]}' \
  https://YOUR_SITE_DOMAIN/api/revalidate
```
- Preview
```bash
# Valid secret enables preview and redirects to /home
curl -I "https://YOUR_SITE_DOMAIN/api/preview?secret=$SANITY_PREVIEW_SECRET&slug=home"
```
- Confirm preview mode
  - Enable preview → draft-only change appears; disable preview (clear cookies or hit invalid secret) → only published shows.

## 6) Action Plan (PRs)

1) Consolidate Sanity client
   - Canonical: `sanity/lib/client.ts`; re-export via `lib/cms/sanityClient.ts`. Replace UI imports of other clients.
   - Delete or redirect `lib/sanity.client.ts` and usages to the single factory.
2) Env validation
   - Add runtime checks in `lib/env.ts` for required envs and helpful errors.
3) Remove projectId fallback
   - Already enforced in `lib/sanity.ts:L5`; ensure Studio envs documented for deployments.
4) Add `/api/cms/health`
   - New API route returning the following to catch miswires fast:
     ```json
     {
       "ok": true,
       "projectId": "...",
       "dataset": "production",
       "preview": false,
       "publishedSampleMs": 42,
       "previewSampleMs": 55,
       "canPreviewDrafts": true
     }
     ```
     Implement by running two tiny GROQs (published and previewDrafts when token present) and timing them.
5) Configure webhooks in prod
   - Ensure both revalidate and redirects are set with correct secret.
6) Update README
   - Add CMS instructions, link to this document, and curl examples.

### Studio vs Site env mapping (where to set)

| Variable | Used by | Where to set |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Site & Studio | Hosting env + Sanity Manage (Studio) |
| `NEXT_PUBLIC_SANITY_DATASET` | Site & Studio | Hosting env + Sanity Manage (Studio) |
| `SANITY_API_TOKEN` | Site (server) & Studio (mutations) | Hosting env (server only) + Sanity Manage |
| `REVALIDATE_SECRET` | Site only | Hosting env + used as webhook header in Sanity |
| `SANITY_PREVIEW_SECRET` | Site only | Hosting env; used in preview URL |

Notes:
- Ensure `SANITY_API_TOKEN` is project‑scoped with Editor role; never exposed client‑side.
- Add friendly startup errors in `lib/env.ts` when any required env is missing (fail fast in production with human‑readable messages).

## 7) Verification Checklist

- Publish flow
  - [ ] Publish in Sanity → webhook hits `/api/revalidate` → site reflects change.
- Preview flow
  - [ ] `/api/preview?secret=...` shows draft; disabling preview shows published.
- Health check
  - [ ] `/api/cms/health` returns `ok:true`, correct `projectId`/`dataset`, non‑null timings, and `canPreviewDrafts:true`.

---
If you want, I can add a small automation to ping `/api/cms/health` and alert on failures. Say “yes” and I’ll include it.
