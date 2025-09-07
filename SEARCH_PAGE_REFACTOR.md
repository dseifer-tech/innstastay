# Search Page Refactor - Booking.com Style Layout

## Overview
The search page has been refactored to implement a Booking.com-style layout with improved user experience and filtering capabilities.

## New Components

### 1. TopSearchBar (`app/components/TopSearchBar.tsx`)
- **Purpose**: Sticky search bar at the top of the search page
- **Features**:
  - Date range selection with ProfessionalCalendar integration
  - Guest/room selection with modal interface
  - URL parameter normalization (supports both `checkin`/`check_in` and `checkout`/`check_out`)
  - Updates URL on search without client-side fetching
  - Responsive design with compact fields

### 2. AmenitiesFilter (`app/components/AmenitiesFilter.tsx`)
- **Purpose**: Left sidebar filter panel for hotel amenities
- **Features**:
  - Server-side generated facets from Sanity hotel data
  - Checkbox-based filtering with counts
  - URL-driven state management
  - Clear filters functionality
  - Top 10 most common amenities displayed

### 3. SearchHotelCard (`app/components/hotel/SearchHotelCard.tsx`)
- **Purpose**: Simplified hotel card for list view
- **Features**:
  - Booking.com-style layout (image left, details right)
  - Responsive image handling with fallbacks
  - Price display with CLS-safe space reservation
  - Optional PriceBadge integration
  - Hover effects and transitions

### 4. ViewToggle (`app/components/ViewToggle.tsx`)
- **Purpose**: Toggle between list and grid views
- **Features**:
  - Clean toggle interface
  - State management for view preferences
  - Responsive design

### 5. SearchResultsClient (`app/components/SearchResultsClient.tsx`)
- **Purpose**: Client wrapper for search results with view state
- **Features**:
  - Handles view toggle state
  - Renders appropriate card layout (list vs grid)
  - Results count and filter status display
  - No results state handling

## Updated Search Page (`app/search/page.tsx`)

### Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│                    TopSearchBar (sticky)                │
├─────────────────────────────────────────────────────────┤
│ Filters │                    Results                    │
│ Sidebar │                    Column                     │
│         │                                              │
│ Amenities│  ┌─────────────────────────────────────────┐ │
│ Filter   │  │ Results Header + View Toggle           │ │
│          │  ├─────────────────────────────────────────┤ │
│ Budget   │  │ Hotel Card 1                           │ │
│ (placeholder)│ Hotel Card 2                           │ │
│          │  │ Hotel Card 3                           │ │
│          │  │ ...                                    │ │
│          │  └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Key Features
- **Server-side filtering**: All filtering happens on the server before rendering
- **URL-driven state**: All filters and search parameters are reflected in the URL
- **Responsive design**: Mobile-friendly with collapsible filters
- **Performance optimized**: Uses existing Sanity data source, no additional API calls
- **SEO friendly**: Maintains existing SEO structure and metadata

### Data Flow
1. URL parameters → `normalizeSearchParams()` → `getHotelsForSearch()`
2. Sanity returns hotels → Server-side filtering by amenities
3. Build amenities facets from filtered results
4. Render components with filtered data
5. Client-side view toggle and interactions

## Technical Implementation

### URL Parameter Support
- `checkin` / `check_in` - Check-in date
- `checkout` / `check_out` - Check-out date  
- `adults` - Number of adults
- `children` - Number of children
- `rooms` - Number of rooms
- `amenities` - Comma-separated list of selected amenities

### Amenities Filtering Logic
- Case-insensitive matching
- Partial string matching (e.g., "Wi-Fi" matches "Free Wi-Fi")
- AND logic (all selected amenities must be present)
- Server-side filtering before rendering

### CSS Additions
- Added line-clamp utilities for text truncation
- Responsive grid layouts
- Sticky positioning for search bar and filters

## Acceptance Criteria Met

✅ **Top search bar** appears on `/search` and controls URL params; server re-renders on submit

✅ **Left panel** shows amenity facets computed from current Sanity results; selecting filters updates the URL and the server filters the list

✅ **Right column** shows simplified cards using SearchHotelCard (no raw SerpApi/Sanity props); images via next/image

✅ **No component performs data fetching**; all content flows through `getHotelsForSearch(opts)`; pricing remains optional (PriceBadge) and non-blocking

✅ **Param normalization** supports `checkin`|`check_in` and `checkout`|`check_out`

✅ **Code respects existing rules**: SoT, canonical Hotel, no inline GROQ, no external fetches in components/pages

## Future Enhancements
- Budget filter implementation
- Mobile filter sheet/drawer
- Sorting options (price, rating, distance)
- Pagination for large result sets
- Advanced search filters (star rating, hotel type, etc.)
