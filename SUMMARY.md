# InnstaStay - Project Summary

## Repository X-Ray

### Routing Architecture

**Static Client Pages:**
- `/` - Home page (static from code)
- `/about` - About page (static from code) 
- `/contact` - Contact page (static from code)
- `/hotels/toronto-downtown` - Toronto Downtown landing page (static from code)

**Server Routes with CMS Integration:**
- `/hotels/[slug]` - Hotel detail pages (server-side with Sanity CMS for hotel data + SerpApi for live rates)

**Admin Routes:**
- `/studio/[[...tool]]` - Sanity Studio interface
- `/api/admin/*` - Admin API endpoints (hotel management)

> ⚠️ **Important**: Marketing/utility pages are static from code. They do NOT use CMS, draftMode, or revalidate flows.

### CMS Schemas & Queries

**Active Schemas (Hotel-Only):**
- `hotel.ts` - Hotel objects (name, slug, address, images, amenities, metadata)
- `location.ts` - Location/area groupings for hotels
- `seo.ts` - SEO metadata (used by hotel/location schemas)

**Deprecated/Legacy Schemas:**
> ⚠️ **Only hotel/location schemas are active. Page/fragment schemas are legacy and should be deleted.**

- `page.ts` - ❌ DEPRECATED (marketing pages are now static)
- `siteSettings.ts` - ❌ DEPRECATED (site settings moved to code)
- `navigation.ts` - ❌ DEPRECATED (navigation is static)
- `redirect.ts` - ❌ DEPRECATED (redirects handled by Next.js)
- `fragment.ts` - ❌ DEPRECATED (no more reusable CMS fragments)
- Block schemas in `blocks/` directory:
  - `faq.ts` - ❌ DEPRECATED
  - `poiGrid.ts` - ❌ DEPRECATED
  - `hero.ts` - ❌ DEPRECATED
  - `richText.ts` - ❌ DEPRECATED
  - `hotelCarousel.ts` - ❌ DEPRECATED
  - `fragmentRef.ts` - ❌ DEPRECATED
  - `searchWidget.ts` - ❌ DEPRECATED
  - `secondaryCta.ts` - ❌ DEPRECATED
  - `poi.ts` - ❌ DEPRECATED

### File/Directory Map

```
app/
├── page.tsx                     # Home (static client)
├── about/page.tsx               # About (static client)  
├── contact/page.tsx             # Contact (static client)
├── hotels/
│   ├── toronto-downtown/page.tsx # Landing (static client)
│   └── [slug]/page.tsx          # Hotel detail (server + Sanity/SerpApi)
├── api/
│   ├── admin/hotels/*           # Hotel admin endpoints
│   └── preview/                 # Preview API (hotel content only)
└── components/                  # Shared UI components

lib/
├── cms/                         # Sanity client & hotel queries
├── env.ts                       # Environment validation
└── services/                    # SerpApi & other external services

sanity/
└── schemaTypes/
    ├── hotel.ts                 # ✅ ACTIVE - Hotel schema
    ├── location.ts              # ✅ ACTIVE - Location schema  
    ├── seo.ts                   # ✅ ACTIVE - SEO metadata
    └── [legacy files]           # ⚠️ DEPRECATED - Safe to delete
```

### Environment Variables

**Required Variables:**
```bash
# Sanity CMS (Hotel Data)
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_editor_token

# Live Pricing
SERPAPI_KEY=your_serpapi_key
PRICE_DEBUG=0
PRICE_WRITE_FILES=0

```

**Removed/Deprecated Variables:**
- ❌ `USE_CMS_PAGES` - No longer needed (marketing pages are static)
- ❌ `SANITY_PREVIEW_SECRET` - No page preview flows
- ❌ `REVALIDATE_SECRET` - No page revalidation

### Data Flow

1. **Hotel Content**: Sanity CMS → Server Components → Hotel Pages
2. **Live Pricing**: SerpApi → Server Actions → Hotel Pages  
3. **Static Content**: Code → Client Components → Marketing Pages

### Scripts & Maintenance

**Active Scripts:**
- `purge-non-hotel.js` - Removes non-hotel content from Sanity

**Deprecated Scripts:**
- ❌ `sync-static-pages.js` - Pages are now static from code
- ❌ `import-pois-hardcoded.js` - POI system deprecated
- ❌ `backfill-poi-images.js` - POI system deprecated

### Build & Deployment

```bash
# Development
pnpm dev

# Production Build  
pnpm build && pnpm start

# Testing
pnpm test && pnpm lint
```

**Key Points:**
- Hotel pages are server-rendered with Sanity + SerpApi data
- Marketing pages are static client components (no CMS dependency)
- No preview/draft modes for marketing content
- No revalidation webhooks for marketing content
