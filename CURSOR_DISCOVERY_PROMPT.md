# 🔍 Cursor Discovery Prompt for InnstaStay

Please generate a detailed project map and code flow explanation for this repository:

## 📁 Directory Structure Analysis

Start by listing the directory structure with key files:
- `/app` - Next.js app router pages and components
- `/lib` - Core business logic, adapters, and utilities
- `/components` - Reusable UI components
- `/types` - TypeScript type definitions
- `/sanity` - Sanity CMS configuration and schema
- `/api` - Next.js API routes
- `/public` - Static assets

For each folder, explain the purpose and how the files interact.

## 🔄 Data Flow Tracing

### Core Data Architecture:
1. **Sanity CMS** → Single source of truth for hotel content
2. **Adapters** (`/lib/adapters/sanityHotel.ts`) → Convert Sanity docs to canonical `Hotel` type
3. **Data Access** (`/lib/hotelSource.ts`) → Fetch and enrich data
4. **Components** → Consume `Hotel` objects for rendering

### End-to-End Flows:

#### Search Flow:
```
Search Page → getHotelsForSearch() → Sanity fetch → fromSanityHotel() → HotelCard[]
```

#### Slug Page Flow:
```
Slug Page → getHotelBySlug() → Sanity fetch → fromSanityHotel() → Live pricing enrichment → HotelDetails
```

#### Pricing Enrichment:
```
/api/price → SerpAPI → extractOfficialFeatured() → Room-level pricing + images
```

## 🌐 Website User Experience

### User Journey:
1. **Homepage** - Search form with date picker
2. **Search Results** - Hotel cards with optional PriceBadge enrichment
3. **Slug Pages** - Hotel details + official featured rooms with pricing

### Key Components:
- `HomePageClient.tsx` - Main search interface
- `HotelCard.tsx` - Search result cards
- `HotelDetails.tsx` - Individual hotel pages with room pricing
- `PriceBadge.tsx` - Client-side pricing enrichment
- `Navigation.tsx` - Global navigation

## 🏗️ Architecture Patterns

### Cursor Rules Compliance:
- **Sanity SoT**: All content from Sanity, pricing is additive only
- **Canonical Types**: Everything uses `Hotel` from `/types/hotel.ts`
- **Data Access Layer**: Only `getHotelsForSearch()` and `getHotelBySlug()`
- **API Boundaries**: Only `/api/price` and `/api/hotels` call external APIs
- **Component Rules**: Props must be `{ hotel: Hotel }`

### Key Files to Analyze:
- `/lib/hotelSource.ts` - Main data access layer
- `/lib/adapters/sanityHotel.ts` - Sanity → Hotel conversion
- `/lib/live/officialFeatured.ts` - SerpAPI response parsing
- `/lib/bookingLink.ts` - URL template processing
- `/types/hotel.ts` - Canonical Hotel interface
- `/app/api/price/route.ts` - Pricing proxy with debugging
- `/app/api/image-proxy/route.ts` - CORS bypass for external images

## 🔍 Areas to Identify

### Potential Consolidation:
- Image handling logic (hotel vs room images)
- Price formatting utilities
- URL parameter parsing
- Error handling patterns

### Data Flow Dependencies:
- How search parameters flow through the system
- How pricing enrichment integrates with Sanity content
- How image proxying works for different sources
- How booking links are generated and used

## 📊 Output Format

Please provide:

1. **Visual Map**: ASCII diagram or bullet hierarchy showing:
   - Directory structure
   - Data flow arrows
   - Component relationships

2. **Narrative Explanation**: How the pieces connect:
   - Sanity content management
   - Live pricing enrichment
   - User interface rendering
   - API integration patterns

3. **Architecture Assessment**: 
   - Current strengths
   - Potential improvements
   - Duplicate logic identification
   - Consolidation opportunities

**Don't change code yet** — just produce a clear blueprint of how things are wired today.
