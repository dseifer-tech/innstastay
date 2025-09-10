# Rate Debugging Guide

Use these scripts to debug SerpAPI rate issues and inspect what data is actually being returned.

## Quick Start

```bash
# Test SerpAPI directly
node scripts/debug-serpapi.js

# Test with specific hotel and dates
node scripts/debug-serpapi.js --hotel="fairmont royal york" --checkin=2024-12-15 --checkout=2024-12-16

# Test complete hotel search flow (requires local server)
npm run dev
# In another terminal:
node scripts/debug-hotel-search.js

# Compare rates across multiple hotels
node scripts/debug-serpapi.js --compare=true
```

## What These Scripts Show

### `debug-serpapi.js` - Raw SerpAPI Analysis
- **Request URL**: Exact API call being made
- **Rate Structure**: How rates are formatted in response
- **Currency Issues**: USD vs CAD problems
- **Property Data**: All available hotel information
- **JSON Export**: Saves complete response for inspection

### `debug-hotel-search.js` - Full Flow Testing  
- **Sanity Data**: Hotels available in CMS
- **Price Enrichment**: Tests `/api/price` endpoint
- **Search Results**: Complete search page flow
- **Rate Matching**: How hotel tokens map to SerpAPI queries

## Common Rate Issues to Look For

### ❌ Problems You Might See:
```json
{
  "rate_per_night": {
    "lowest": "from $299",  // ❌ Text instead of number
    "currency": "USD",      // ❌ Wrong currency 
    "type": "total"         // ❌ Unclear if per night
  }
}
```

### ✅ Good Rate Data:
```json
{
  "rate_per_night": {
    "lowest": "349",        // ✅ Numeric value
    "currency": "CAD",      // ✅ Correct currency
    "type": "per_night"     // ✅ Clear rate type
  }
}
```

## Debugging Checklist

1. **Check SerpAPI Response**:
   ```bash
   node scripts/debug-serpapi.js --hotel="your-hotel-name"
   ```
   - Are rates present?
   - Is currency CAD or USD?
   - Are values numeric or text?

2. **Check Hotel Token Mapping**:
   ```bash
   node scripts/debug-hotel-search.js --hotel=hotel-slug
   ```
   - Does hotel slug match SerpAPI query?
   - Is the right hotel being found?

3. **Check Search Parameters**:
   ```bash
   # Test homepage search flow
   node scripts/debug-hotel-search.js --checkin=2024-12-15 --checkout=2024-12-16
   ```
   - Are dates being passed correctly?
   - Do adults/children/rooms match?

4. **Inspect Raw Data**:
   - Scripts save JSON files with complete responses
   - Look for rate_per_night vs booking_option differences
   - Check if multiple properties are returned

## Rate Display Chain

```
SearchBlock → /search → getHotelsForSearch() → SerpAPI → Price Enrichment → PriceBadge
```

**Break points to check**:
- SearchBlock: Are params `checkin/checkout/adults`?
- SerpAPI: Are rates returned in response?
- Price Enrichment: Is `hotel.price.nightlyFrom` set?
- PriceBadge: Does component receive `hotel.price`?

## Environment Setup

Make sure you have:
```bash
# .env.local
SERPAPI_KEY=your_key_here
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
```

## Quick Fixes to Test

1. **Currency Issue**: Look for USD rates being shown as CAD
2. **Rate Format**: Check if "from $X" text needs parsing
3. **Hotel Matching**: Verify hotel names match between Sanity and SerpAPI
4. **Date Format**: Ensure YYYY-MM-DD format for check-in/out

## Example Debug Session

```bash
# Start with basic SerpAPI test
node scripts/debug-serpapi.js

# If rates look good, test specific hotel
node scripts/debug-serpapi.js --hotel="fairmont royal york toronto"

# If still good, test full search flow
npm run dev &
node scripts/debug-hotel-search.js

# Check the JSON output files for detailed inspection
```

The scripts will tell you exactly what's happening at each step!
