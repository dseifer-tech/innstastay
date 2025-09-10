# InnstaStay

Commission-free hotel discovery and booking UI for Toronto.

Marketing pages render from code (client pages). Hotel content (metadata, images, live pricing) uses server integrations (Sanity for hotel data, SerpApi for Google Hotels rates).

## TL;DR

- Framework: Next.js 14 (App Router), React 18, TypeScript, Tailwind
- Data: Sanity only for hotel objects; SerpApi for live rates
- Marketing pages: no CMS. Home, About, Contact, Toronto Downtown are pure client components
- Tests: Jest
- Scripts: `dev`, `build`, `start`, `lint`, `test`

## Project Structure

```
app/
  page.tsx                     # Home (client)
  about/page.tsx               # About (client)
  contact/page.tsx             # Contact (client)
  hotels/
    toronto-downtown/page.tsx  # Landing (client)
    [slug]/page.tsx            # Hotel detail (server; uses Sanity/SerpApi)
  api/                         # Admin + hotel endpoints only (no page preview/revalidate)

components/                    # Shared UI

lib/                           # Hotel data access (Sanity client where required), pricing services

sanity/
  schemaTypes/                 # Only hotel-related schemas

scripts/
  purge-non-hotel.js           # One-shot: deletes page/marketing docs from Sanity
```

## Environment Variables

Create `.env.local` (and set in hosting env):

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_editor_token

SERPAPI_KEY=your_serpapi_key
PRICE_DEBUG=0
PRICE_WRITE_FILES=0

```

Removed: USE_CMS_PAGES, SANITY_PREVIEW_SECRET, page revalidate secrets/webhooks.

## Local Development

```
pnpm i
pnpm dev
```

Visit `/`, `/about`, `/contact`, `/hotels/toronto-downtown` → all render from client pages.

Visit `/hotels/<slug>` → server route that reads hotel data (Sanity) and rates (SerpApi).

## Build & Run

```
pnpm build
pnpm start
```

## Tests & Lint

```
pnpm test
pnpm lint
```

## Data Model

Hotels (Sanity): name, slug, address, images, amenities, and any metadata needed by `[slug]/page.tsx`.

Rates (SerpApi): fetched on demand (or cached) server-side for price badges and comparisons.

## What’s intentionally not in CMS

- Home/About/Contact/Toronto-Downtown content and layout
- Page preview/draft mode
- Page webhooks/revalidate

## Security

- Sanity token stays server-side only
- Admin endpoints should remain behind auth (see `/app/api/admin/*`)
- Do not re-introduce public preview or page-level revalidate secrets — marketing pages are static from code

## Data Model

**Sanity CMS**: Hotel metadata only - name, slug, address, images, amenities, and SEO data.

**SerpApi**: Live hotel rates and pricing data fetched server-side.

**Static Pages**: All marketing content (Home, About, Contact, Toronto Downtown) is coded directly in React components.


