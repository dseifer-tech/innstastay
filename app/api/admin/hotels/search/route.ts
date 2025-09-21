import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs';

const SERPAPI_KEY = process.env.SERPAPI_KEY

function formatDateForSerpAPI(date: Date): string {
  return date.toISOString().split('T')[0] // Format as YYYY-MM-DD
}

export async function POST(request: NextRequest) {
  try {
    // Security: Validate API key
    if (!process.env.SERPAPI_KEY) {
      return NextResponse.json({
        success: false,
        error: 'API key not configured'
      }, { status: 500 })
    }

    const body = await request.json()
    const { query } = body

    if (!query) {
      return NextResponse.json({
        success: false,
        error: 'Search query is required'
      }, { status: 400 })
    }

    // Security: Input validation and sanitization
    if (typeof query !== 'string' || query.length > 200) {
      return NextResponse.json({
        success: false,
        error: 'Invalid search query'
      }, { status: 400 })
    }

    // Set default dates: check-in today, check-out tomorrow
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const checkInDate = formatDateForSerpAPI(today)
    const checkOutDate = formatDateForSerpAPI(tomorrow)

    // Security: Use environment variable directly
    const searchUrl = `https://serpapi.com/search.json?engine=google_hotels&q=${encodeURIComponent(query)}&check_in_date=${checkInDate}&check_out_date=${checkOutDate}&gl=ca&hl=en&api_key=${process.env.SERPAPI_KEY}`
    
    // console.log('Searching with URL:', searchUrl)
    
    const response = await fetch(searchUrl)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(`SerpAPI error: ${data.error || 'Unknown error'}`)
    }

    // Debug: Log the response structure
    // console.log('SerpAPI Response Keys:', Object.keys(data))
    // console.log('hotels_results:', data.hotels_results)
    // console.log('organic_results:', data.organic_results)
    // console.log('ads:', data.ads)
    // console.log('properties:', data.properties)
    // console.log('search_metadata:', data.search_metadata)
    // console.log('Full response preview:', JSON.stringify(data, null, 2).substring(0, 1000))

    // Extract hotel names and property tokens from ads[] and properties[] arrays
    const hotelOptions: { name: string; property_token: string }[] = []
    const seenTokens = new Set<string>()

    // Check ads array
    if (Array.isArray(data.ads)) {
      data.ads.forEach((item: any) => {
        const name = item.name || null
        const property_token = item.property_token || null
        
        if (name && property_token && !seenTokens.has(property_token)) {
          hotelOptions.push({ name, property_token })
          seenTokens.add(property_token)
        }
      })
    }

    // Check properties array
    if (Array.isArray(data.properties)) {
      data.properties.forEach((item: any) => {
        const name = item.name || null
        const property_token = item.property_token || null
        
        if (name && property_token && !seenTokens.has(property_token)) {
          hotelOptions.push({ name, property_token })
          seenTokens.add(property_token)
        }
      })
    }

    // Fallback: If no hotels found in ads/properties, try the old method
    if (hotelOptions.length === 0) {
      let hotels = []
      
      // For Google Hotels, the response might be a single hotel object
      if (data.name && data.property_token) {
        // Single hotel result
        hotels = [data]
      } else if (data.hotels_results && Array.isArray(data.hotels_results)) {
        hotels = data.hotels_results
      } else if (data.organic_results && Array.isArray(data.organic_results)) {
        hotels = data.organic_results
      } else if (data.hotels && Array.isArray(data.hotels)) {
        hotels = data.hotels
      } else if (data.results && Array.isArray(data.results)) {
        hotels = data.results
      }

      // Extract just name and property_token from fallback results
      hotels.forEach((hotel: any) => {
        const name = hotel.name || hotel.title || null
        const property_token = hotel.property_token || null
        
        if (name && property_token && !seenTokens.has(property_token)) {
          hotelOptions.push({ name, property_token })
          seenTokens.add(property_token)
        }
      })
    }

    // console.log('Found hotel options:', hotelOptions.length)

    return NextResponse.json({
      success: true,
      hotelOptions: hotelOptions,
      searchDates: {
        checkIn: checkInDate,
        checkOut: checkOutDate
      },
      rawData: data // Include the raw SerpAPI response
    })

  } catch (error) {
    // Security: Don't expose internal errors to client
    console.error('Error searching hotels:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to search hotels'
    }, { status: 500 })
  }
}
