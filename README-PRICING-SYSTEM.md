# Pricing System Architecture & Today's Fixes

## Overview
This document outlines the pricing extraction system architecture and the critical fixes implemented today to resolve room image display issues.

## System Architecture

### Core Components

#### 1. **`lib/services/pricing.server.ts`** - Main Orchestrator
- **Purpose**: Fetches raw SerpAPI data and coordinates extraction
- **Key Function**: `fetchOfficialFeatured()`
- **Responsibility**: Network calls, error handling, data coordination

#### 2. **`lib/live/official.ts`** - Price Orchestrator
- **Purpose**: Determines best price from multiple sources
- **Key Function**: `extractOfficialBest()`
- **Logic**: Prioritizes `featured_prices` over `prices` array

#### 3. **`lib/live/officialFeatured.ts`** - Featured Prices Extractor
- **Purpose**: Extracts from `featured_prices` array
- **Key Functions**: 
  - `extractOfficialFeatured()` - New system
  - `extractOfficialFeaturedLegacy()` - Room extraction

#### 4. **`lib/live/officialPrices.ts`** - Prices Array Extractor
- **Purpose**: Extracts from `prices` array
- **Key Function**: `extractOfficialPrices()`

#### 5. **`lib/live/imageProxy.ts`** - Image Proxying SoT
- **Purpose**: Single source of truth for image proxying
- **Key Function**: `proxyImage()`
- **Path**: `/api/hotel-images?url=`

#### 6. **`lib/hotelSource.ts`** - Integration Layer
- **Purpose**: Combines Sanity data with live pricing
- **Responsibility**: Applies image proxying to room images

## Data Flow

```
SerpAPI Response
    ↓
lib/services/pricing.server.ts (fetchOfficialFeatured)
    ↓
lib/live/official.ts (extractOfficialBest)
    ↓
lib/live/officialFeatured.ts OR lib/live/officialPrices.ts
    ↓
lib/hotelSource.ts (getHotelBySlug)
    ↓
lib/live/imageProxy.ts (proxyImage)
    ↓
Frontend Components
```

## Business Logic Rules

### Price Extraction Priority
1. **`featured_prices` array** (preferred)
   - Check for `official: true` entries
   - Extract room images and details
2. **`prices` array** (fallback)
   - Check for `official: true` entries
   - Only extract rooms if they have actual room data

### Room Display Rules
1. **If official price in `featured_prices`**: Show price badge + room images
2. **If official price only in `prices`**: Show price badge only (no rooms)
3. **If no official price anywhere**: Show nothing

### Image Proxying Rules
- **SoT**: Only `lib/live/imageProxy.ts` can proxy images
- **Application**: Only `lib/hotelSource.ts` calls `proxyImage()`
- **Path**: `/api/hotel-images?url=`
- **Guard**: Prevents double-proxying

## Today's Critical Fixes

### 1. **Fixed Fallback Room Creation Bug**
**Problem**: System was creating fake "Standard Room" cards when no room data existed.

**Root Cause**: In `lib/services/pricing.server.ts`, the fallback logic was creating rooms even when the official price in `prices` array had no room data.

**Fix**: Added filter to only create rooms when official price has actual room data:
```typescript
.filter((price: any) => price.room && (price.room.name || price.room.image))
```

**Result**: No more fake "Standard Room" cards when they shouldn't exist.

### 2. **Established Image Proxying SoT**
**Problem**: Image proxying was scattered across multiple files, causing inconsistencies.

**Solution**: 
- Created `lib/live/imageProxy.ts` as single source of truth
- Removed proxying from all extraction modules
- Only `lib/hotelSource.ts` applies proxying

**Result**: Consistent image proxying across the application.

### 3. **Enhanced Price Extraction Logic**
**Problem**: Missing direct price fields in `pickPrice()` function.

**Fix**: Updated `lib/live/types.ts` to include direct price fields:
```typescript
if (obj?.extracted_before_taxes_fees) return safeNumber(obj.extracted_before_taxes_fees);
if (obj?.extracted_lowest) return safeNumber(obj.extracted_lowest);
if (obj?.extracted_total) return safeNumber(obj.extracted_total);
```

**Result**: Proper headline price extraction.

### 4. **Improved Room Extraction Priority**
**Problem**: System was only extracting rooms from the winning price source.

**Fix**: Always try `featured_prices` first for room images, then fall back to `prices` array.

**Result**: Better room image availability.

## File Structure

```
lib/
├── services/
│   └── pricing.server.ts          # Main orchestrator
├── live/
│   ├── official.ts                # Price orchestrator
│   ├── officialFeatured.ts        # Featured prices extractor
│   ├── officialPrices.ts          # Prices array extractor
│   ├── imageProxy.ts              # Image proxying SoT
│   └── types.ts                   # Shared types & utilities
└── hotelSource.ts                 # Integration layer
```

## Environment Variables

- `DEBUG_PRICING=1` - Enable detailed pricing extraction logs
- `PRICE_DEBUG=1` - Enable SerpAPI response logging
- `PRICE_WRITE_FILES=1` - Save SerpAPI responses to files

## Testing

### Manual Testing
1. Visit hotel slug page
2. Check if price badge appears correctly
3. Verify room images show only when they should exist
4. Confirm no fake "Standard Room" cards appear

### Debug Testing
1. Set `DEBUG_PRICING=1` in `.env.local`
2. Check console logs for extraction details
3. Verify image proxying paths

## Key Takeaways

1. **SoT Principle**: Centralize specific logic (image proxying, price extraction)
2. **Data Validation**: Only create UI elements when actual data exists
3. **Fallback Logic**: Graceful degradation without creating fake data
4. **Debugging**: Comprehensive logging for troubleshooting

## Future Improvements

1. Add unit tests for extraction logic
2. Implement caching for SerpAPI responses
3. Add error boundaries for failed extractions
4. Consider rate limiting for SerpAPI calls
