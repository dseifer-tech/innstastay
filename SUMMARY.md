# Project Snapshot

- **Framework**: Next.js ^14.2.31 (App Router) (package.json)
- **React**: ^18 (package.json)
- **TypeScript**: ^5 (package.json), strict mode enabled (tsconfig.json:L7)
- **Node runtime hints**:
  - API route sets runtime nodejs (app/api/price/route.ts:L9)
  - No engines field in package.json (package.json)
- **Styling**: Tailwind CSS ^3.3.0 (package.json), global stylesheet (app/globals.css)
- **CMS**: Sanity v4 (sanity/schemaTypes/*, lib/cms/*)
- **Testing**: Jest ^30 (jest.config.js, tests/*)
- **Build/Deploy hints**:
  - Next image remote patterns and security headers in next.config.js (next.config.js:L6–L86)
  - Bundle analyzer optional via ANALYZE env (next.config.js:L2–L4)
  - No vercel.json, Dockerfile, or CI configs found in repo

## TypeScript / JSX
- TS/TSX used across app and lib (tsconfig.json includes **/*.ts, **/*.tsx; tsconfig.json:L25)
- Path alias `@/*` to repo root (tsconfig.json:L21–L23)

## package.json Overview

| Field | Value |
|---|---|
| name | innstastay |
| version | 0.1.0 |
| private | true |

### Scripts

| Script | Command |
|---|---|
| dev | next dev |
| build | next build |
| start | next start |
| lint | next lint |
| test | jest --runInBand |
| test:watch | jest --watch |
| test:coverage | jest --coverage |
| test:ci | jest --ci --coverage --watchAll=false |
| analyze | ANALYZE=true npm run build |
| seo:* | sitemap/robots/test/view helpers (scripts/*.js) |
| sanity:* | dev env and workflow helpers (scripts/*.js) |

### Key Dependencies

| Package | Version |
|---|---|
| next | ^14.2.31 |
| react | ^18 |
| react-dom | ^18 |
| typescript | ^5 |
| tailwindcss | ^3.3.0 |
| next-sanity | ^10.0.13 |
| sanity | ^4.5.0 |
| @sanity/image-url | ^1.1.0 |
| lucide-react | ^0.294.0 |
| zod | ^4.0.17 |

So what? These confirm a modern Next.js App Router + Sanity stack, TS strict settings, and testing via Jest.

# File & Directory Map

- Root notable folders:
  - `app/`: Next.js App Router pages, API routes, components
  - `lib/`: core logic, CMS adapters/queries, services, security
  - `components/` under app: shared UI pieces (app/components/*)
  - `sanity/`: Studio schemas/config
  - `scripts/`: Node scripts for CMS/data/SEO
  - `public/` and `dist/`: static assets
  - `tests/`: Jest tests

Condensed tree (first two levels, excluding node_modules, build artifacts):

- `app/`
  - `about/` (page.tsx, AboutPageClient.tsx)
  - `admin/` (page.tsx)
  - `admin-server/` (page.tsx)
  - `api/` (admin/hotels/*, image-proxy, price, navigation, revalidate, redirects, preview, hotels, hotel-images, sanity-create-hotel)
  - `components/` (SectionRenderer.tsx, Portable.tsx, Navigation.tsx, etc.)
  - `contact/` (layout.tsx, page.tsx, ContactPageClient.tsx)
  - `hotels/` ([slug]/page.tsx, toronto-downtown/page.tsx)
  - `privacy/` (page.tsx)
  - `robots.ts`, `sitemap.ts`, `not-found.tsx`, `layout.tsx`, `page.tsx`
- `lib/`
  - `cms/` (flags.ts, page.ts, navigation.ts, redirects.ts, sanityClient.ts, settings.ts)
  - `core/` (concurrency.ts, img.ts, log.ts, money.ts, url.ts)
  - `live/` (official*.ts, imageProxy.ts, types.ts)
  - `services/` (pricing.server.ts)
  - `sanity*.ts` (clients, images)
  - other helpers (bookingLink.ts, constants.ts, queries.ts)
- `sanity/schemaTypes/` (page.ts, siteSettings.ts, navigation.ts, redirect.ts, hotel.ts, location.ts, blocks/*)
- `scripts/` (seo and sanity integration scripts)
- `tests/` (fragments.test.ts, redirects.test.ts)

So what? The app is a single Next.js project with clear separation between pages, APIs, CMS/data code, and scripts.

# Routing (Next.js App Router)

| Route | File owner | Notes |
|---|---|---|
| / | app/page.tsx | dynamic: force-static (L9), revalidate 3600 (L10); uses CMS when `USE_CMS_PAGES`; generateMetadata present (L12–L36); renders client + CMS sections (L38–L53) |
| /about | app/about/page.tsx | uses CMS + draftMode with fallback to AboutPageClient; generateMetadata (L8–L32); server component with SectionRenderer |
| /contact | app/contact/page.tsx | uses CMS + draftMode with fallback to ContactPageClient; layout.tsx present; generateMetadata (L8–L32) |
| /privacy | app/privacy/page.tsx | present; content not scanned here, exists as page |
| /hotels/[slug] | app/hotels/[slug]/page.tsx | dynamic route; contains JSON-LD blocks via dangerouslySetInnerHTML |
| /hotels/toronto-downtown | app/hotels/toronto-downtown/page.tsx | CMS with draft fallback; generateMetadata (L8–L30) |
| /admin | app/admin/page.tsx | page present |
| /admin-server | app/admin-server/page.tsx | page present |
| /robots.txt | app/robots.ts | MetadataRoute (L3–L11) |
| /sitemap.xml | app/sitemap.ts | Generates from hotels + CMS slugs (L5–L45) |
| 404 | app/not-found.tsx | custom NotFound component |

- Edge vs Node: explicit node runtime only in `app/api/price/route.ts:L9`; others default.
- fetchCache/revalidate settings: homepage has `dynamic` and `revalidate`; others not explicitly set.
- Client vs Server: client components marked with `'use client'` (e.g., app/about/AboutPageClient.tsx:L1, app/components/* where relevant).

So what? Routes mostly SSR/SSG via App Router with some ISR on home; CMS-driven pages have graceful fallbacks.

# API Endpoints (app/api/**)

| Path | Methods | Input | Output | Security/Notes |
|---|---|---|---|---|
| /api/revalidate | POST | header x-revalidate-secret; body {paths[]} (route.ts:L9–L11) | {revalidated: string[]} or 401/400 | Secret check using REVALIDATE_SECRET (L5–L8) |
| /api/redirects | POST | header x-revalidate-secret | {ok:true}/401 | Flushes in-memory redirects cache (route.ts:L1–L9) |
| /api/navigation | GET | none | {mainMenu, footerMenu} | Safe default on error (route.ts:L7–L10) |
| /api/image-proxy | GET | query url | image buffer or JSON error | Simple fetch proxy; sets CORS * (route.ts:L29–L31) |
| /api/price | GET | query property_token, optional dates/adults/children/rooms, debug | minimal price JSON or full when debug=1 | runtime nodejs (L9); uses services/pricing.server.ts; optional logs/files via env flags |
| /api/preview | GET | query secret, slug | sets draft mode? (file exists) | Uses SANITY_PREVIEW_SECRET (app/api/preview/route.ts:L7) |
| /api/hotels | GET | none | list of hotels | Uses lib/sanity.getAllHotels (app/api/admin/hotels/route.ts) |
| /api/admin/hotels/search | POST | {query} | hotelOptions + dates + rawData | Requires SERPAPI_KEY env; input validation and length checks |
| /api/admin/hotels/details | POST | {property_token, originalQuery?} | normalized hotel details + rawData | Requires SERPAPI_KEY; SEO title/description generation included |
| /api/admin/hotels/import | POST | {hotel} | created hotel doc | Requires NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_TOKEN; validates hotel data |
| /api/admin/hotels/create | POST | hotel fields | creates | Uses Sanity client/token (route.ts) |
| /api/admin/hotels/delete | POST | id | deletes | File present |
| /api/admin/hotels/import (root) | POST | same as above | same | (duplicate path under admin/hotels/import/route.ts)
| /api/hotel-images | GET | ... | ... | Exists (route.ts)
| /api/sanity-create-hotel | POST | ... | ... | Exists (route.ts)

So what? Admin APIs integrate with SerpAPI and Sanity; sensitive routes guard with env secrets; image proxy has permissive CORS.

# Data & Integrations

## Environment Variables

| Variable | Files using | Purpose |
|---|---|---|
| USE_CMS_PAGES | lib/cms/flags.ts:L1–L3 | Toggle CMS-rendered pages
| ANALYZE | next.config.js:L2–L4 | Enable bundle analyzer
| REVALIDATE_SECRET | app/api/revalidate/route.ts:L5–L8, app/api/redirects/route.ts:L5–L6 | Protect revalidate endpoints
| SANITY_PREVIEW_SECRET | app/api/preview/route.ts:L7 | Preview mode secret
| NEXT_PUBLIC_SANITY_PROJECT_ID | lib/sanity.ts:L5, lib/sanity.client.ts:L4, sanity/cli.ts:L7, many scripts/* | Sanity project id (public)
| NEXT_PUBLIC_SANITY_DATASET | lib/sanity.client.ts:L5, many scripts/* | Sanity dataset (public)
| SANITY_API_TOKEN | lib/cms/page.ts:L36–L44, admin import routes, many scripts/* | Sanity token for drafts/mutations
| SERPAPI_KEY | app/api/admin/hotels/*, lib/services/pricing.server.ts:L82, app/api/admin/hotels/search/route.ts:L3 | SerpApi access
| PRICE_WRITE_FILES | app/api/price/route.ts:L22 | Permit writing logs to disk
| PRICE_DEBUG | app/api/price/route.ts:L37 | Enable verbose logging of pricing
| NEXT_PUBLIC_GA_ID | lib/env.ts:L7, app/components/Analytics.tsx:L18 | Google Analytics ID
| NODE_ENV | lib/core/log.ts:L7, lib/env.ts:L16,L39 | Standard environment flag
| BASE_URL | scripts/seo-test.js:L9, scripts/robots-txt-generator.js:L7, scripts/sitemap-generator.js:L7 | Script base URL
| SANITY_STUDIO_SERPAPI_KEY | sanity/env.ts:L7 | Studio-side SerpApi key (not used by site code)

Proposed .env.example:

```env
# Feature flags
USE_CMS_PAGES=true # When true, pages render from Sanity where available

# Revalidation/preview security
REVALIDATE_SECRET=your-long-random-string
SANITY_PREVIEW_SECRET=your-preview-secret

# Sanity (public)
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production

# Sanity (server)
SANITY_API_TOKEN=your_sanity_editor_token

# Pricing / SerpApi
SERPAPI_KEY=your_serpapi_key
PRICE_DEBUG=0
PRICE_WRITE_FILES=0

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Build tooling
ANALYZE=0
```

## External Providers/Services
- Sanity CMS (lib/cms/*, sanity/schemaTypes/*)
- SerpApi for Google Hotels (app/api/admin/hotels/*, lib/services/pricing.server.ts)
- Google Tag Manager / GA4 (app/layout.tsx:L107–L130, app/components/GA4RouteTracker.tsx)

## CMS Schemas/Queries
- Schemas: `sanity/schemaTypes/*` including blocks (hero, richText, hotelCarousel, poiGrid, fragmentRef, secondaryCta, faq, searchWidget) and docs (page, fragment, siteSettings, navigation, redirect, hotel, location).
- Queries: GROQ in `lib/cms/page.ts:L11–L45`; navigation (lib/cms/navigation.ts:L3–L5); settings (lib/cms/settings.ts:L14–L16).
- Pages using CMS: `app/page.tsx`, `app/about/page.tsx`, `app/contact/page.tsx`, `app/hotels/toronto-downtown/page.tsx`.

# Security & Privacy

## Headers/CSP/middleware
- Middleware sets rate limiting headers, CORS, `X-Robots-Tag`, and security headers (middleware.ts:L17–L77).
- next.config.js sets strict CSP and security headers for all routes (next.config.js:L51–L84).
- Image allow-list via Next images remotePatterns (next.config.js:L7–L49).

## Origin checks/Input validation
- `validateOrigin` in lib/security.ts:L132–L141; applied in middleware for APIs (middleware.ts:L49–L60).
- Various input validation helpers in lib/security.ts (validateInput, validateEmail, validateUrl, validateRequestBody).
- Admin routes validate env and inputs (e.g., search/details/import route files shown above).

## Secret handling
- No secrets committed; all read via process.env (grep results). README reiterates this (README.md:L124–L131).

## Inline scripts / dangerouslySetInnerHTML
- GTM script (app/layout.tsx:L107–L120).
- JSON-LD in multiple pages/components: app/page.tsx:L73–L78, app/hotels/[slug]/page.tsx (several), app/about/AboutPageClient.tsx:L192–L208, app/contact/ContactPageClient.tsx:L129–L147, app/components/FAQ.tsx:L119–L135.

So what? Strong default headers and middleware; image sources constrained; several inline scripts for analytics/JSON‑LD (expected) with awareness of CSP allowing inline scripts.

# Performance & Caching
- ISR: homepage `revalidate = 3600` and `dynamic = "force-static"` (app/page.tsx:L9–L10).
- API caching hints: image-proxy returns `Cache-Control: public, max-age=3600` (app/api/image-proxy/route.ts:L29).
- Revalidation endpoint for CMS changes (app/api/revalidate/route.ts).
- No use of `unstable_cache` or tag revalidation APIs beyond above.

So what? Basic ISR and manual revalidation are set; more granular caching could be added later if needed.

# SEO & Content
- Global metadata in root layout (app/layout.tsx:L15–L57, L59–L61).
- Per‑page generateMetadata on home/about/contact/downtown (file locations noted above).
- Robots (app/robots.ts) and sitemap (app/sitemap.ts) implemented.
- JSON‑LD present for Website (home), AboutPage, Contact, FAQ, and hotel pages (as noted above).

So what? Solid baseline SEO with sitemap/robots and structured data.

# UI Architecture
- Components in `app/components/*` with Tailwind utility classes; client components marked (e.g., 'use client' in many files).
- SectionRenderer renders CMS sections: hero, richText, searchWidget, hotelCarousel, poiGrid, secondaryCta, faq (app/components/SectionRenderer.tsx:L22–L140).
- Global styles: app/globals.css; fonts via next/font and preloaded (app/layout.tsx:L2–L3, L75–L81).

So what? CMS-driven blocks map to typed renderers; predictable UI structure.

# Testing & Quality
- Jest configured via next/jest; node environment; path alias mapping (jest.config.js:L1–L16).
- Tests present: tests/fragments.test.ts, tests/redirects.test.ts.
- ESLint present via eslint-config-next dependency; no explicit .eslintrc found.
- TypeScript strict true (tsconfig.json:L7).

So what? Basic unit tests exist; TS strictness improves type safety.

# Jobs, Scripts & Tooling
- SEO scripts: `scripts/sitemap-generator.js`, `scripts/robots-txt-generator.js`, `scripts/seo-test.js`, `scripts/view-seo-results.js`.
- Sanity automation: `scripts/*` including seeding, syncing, importing POIs, content approvals, etc.
- No husky/lint-staged or CI config present.

So what? Rich developer tooling for CMS and SEO workflows; no automated CI detected.

# Risk Register (Top 10)

| Title | Why it matters | Files | Fix Plan | Effort | Impact |
|---|---|---|---|---|---|
| Image proxy open CORS | `Access-Control-Allow-Origin: *` could be abused | app/api/image-proxy/route.ts:L29–L31 | Restrict origins via validateOrigin and forward content-type safely | M | M |
| CSP allows 'unsafe-inline' and 'unsafe-eval' | Increases XSS risk | next.config.js:L73–L74 | Replace with nonce/sha-based CSP; remove unsafe-eval; gate GTM via nonce | M | H |
| In-memory rate-limit store | Not distributed; resets per instance | lib/security.ts:L8–L10 | Use Redis or similar shared store in prod | M | M |
| SerpApi key exposure risks | Multiple endpoints depend on it | app/api/admin/hotels/*, lib/services/pricing.server.ts | Ensure key only server-side; add usage quotas/alerts | S | M |
| Preview endpoint behavior | Only checks secret; no slug validation shown | app/api/preview/route.ts | Validate slugs and method; limit scope | S | M |
| Missing CI | No automatic tests/lint/build | (not present) | Add GitHub Actions for lint/test/build | S | M |
| Permissive connect-src to GA domains | Network policy broad | next.config.js:L73–L75 | Tighten to only required domains | S | L |
| Ads/props parsing assumptions | Upstream schema variance | app/api/admin/hotels/search/route.ts:L66–L124 | Add robust schema guards and telemetry | M | M |
| No explicit error pages for API | Generic JSON | multiple | Standardize error shapes and include trace IDs | S | L |
| Static dataset values | Hard-coded projectId fallback | lib/sanity.ts:L5, sanity/env.ts:L3–L5 | Remove hard-coded fallback; require env | S | L |

# Fast Wins / PR Plan

1. Harden CSP and inline script handling
   - Files: next.config.js, app/layout.tsx
   - AC: No 'unsafe-inline'/'unsafe-eval'; GTM uses nonce; site loads.
2. Lock Sanity project ID to env only
   - Files: lib/sanity.ts, sanity/env.ts
   - AC: Build fails without env; docs updated.
3. Restrict image proxy CORS
   - Files: app/api/image-proxy/route.ts, lib/security.ts
   - AC: Origin validated; error handling preserved.
4. Add CI (GitHub Actions)
   - Files: .github/workflows/ci.yml
   - AC: Lint + jest run on PRs; status required.
5. Expand tests for CMS routes and redirects
   - Files: tests/* new files
   - AC: Coverage for redirects cache, sitemap page slugs.
6. Normalize env handling
   - Files: README.md, add .env.example
   - AC: All envs documented and validated at startup.
7. Improve admin API input schemas
   - Files: app/api/admin/hotels/*.ts
   - AC: Zod validation, consistent error shapes.
8. Add shared rate-limit store adapter
   - Files: lib/security.ts
   - AC: Pluggable store; Redis in prod toggled via env.

# Dead Code & Hygiene
- Duplicate/legacy Sanity clients exist (lib/sanity.ts, lib/sanity.client.ts, sanity/lib/client.ts); ensure single source.
- Unreferenced assets likely in dist/ vs public/ (dist/* present alongside public/*).
- Some README claims (e.g., “Centralized queries in lib/queries.ts”) are aspirational; inline GROQ exists in lib/cms/page.ts.
- No .eslintrc or Prettier config in repo; relies on Next defaults.

So what? Consolidating clients and cleaning legacy files will reduce confusion; adding configs and CI will improve maintainability.
