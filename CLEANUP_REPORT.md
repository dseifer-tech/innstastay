# InnstaStay CMS Cleanup Report

## Summary

✅ **CMS narrowed to hotels only. All other schemas/flows are safe to delete.**

## What Was Cleaned Up

### 🗂️ Schema Files Removed
- `sanity/schemaTypes/page.ts` - ❌ DELETED (marketing pages are static)
- `sanity/schemaTypes/siteSettings.ts` - ❌ DELETED (settings moved to code)
- `sanity/schemaTypes/navigation.ts` - ❌ DELETED (navigation is static)
- `sanity/schemaTypes/redirect.ts` - ❌ DELETED (Next.js handles redirects)
- `sanity/schemaTypes/fragment.ts` - ❌ DELETED (no more CMS fragments)
- `sanity/schemaTypes/blocks/` - ❌ DELETED (entire directory and all block schemas)

### 📝 Schema References Cleaned
- Removed `poiRefs` from `hotel.ts` (POI system deprecated)
- Removed `poiRefs` from `location.ts` (POI system deprecated)

### 🔧 Active Schemas (Keep)
- ✅ `hotel.ts` - Hotel metadata, images, amenities
- ✅ `location.ts` - Location/area groupings
- ✅ `seo.ts` - SEO metadata helper

### 🌍 Environment Variables
- ❌ REMOVED: `USE_CMS_PAGES` (no longer needed)
- ❌ REMOVED: `SANITY_PREVIEW_SECRET` (no page previews)
- ❌ REMOVED: `REVALIDATE_SECRET` (no page revalidation)
- ✅ REQUIRED: Sanity CMS variables now validated in `lib/env.ts`

### 📄 Documentation Updated
- ✅ Created `SUMMARY.md` with repository x-ray
- ✅ Simplified `README.md` CMS section
- ✅ This cleanup report created

## Next Steps (Optional)

### 🧹 Scripts to Deprecate
These scripts are safe to remove as they're no longer needed:
- `sync-static-pages.js` - Pages are now static from code
- `import-pois-hardcoded.js` - POI system deprecated  
- `backfill-poi-images.js` - POI system deprecated

### 🔒 Security Hardening (TODO)
- Lock CSP headers (remove unsafe-inline/unsafe-eval)
- Restrict image proxy CORS to trusted origins
- Harden `/api/preview` endpoint validation
- Add schema guards (zod/valibot) for admin APIs
- Add GitHub Actions CI pipeline

## Architecture After Cleanup

```
🏨 Hotel Data: Sanity CMS
├── Hotel metadata (name, slug, address, images, amenities)
├── Location groupings
└── SEO data

💰 Live Pricing: SerpApi
└── Real-time hotel rates

📱 Marketing Pages: Static React Components
├── Home page
├── About page  
├── Contact page
└── Toronto Downtown landing
```

**Result**: Clean, focused architecture with hotel-only CMS and static marketing pages.
