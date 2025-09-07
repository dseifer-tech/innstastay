import { NextRequest, NextResponse } from 'next/server'

const SERPAPI_KEY = process.env.SERPAPI_KEY

// Function to generate SEO title following the specified rules
function generateSeoTitle(hotelName: string, brand?: string, city: string = 'Toronto'): string {
  // Clean and prepare the hotel name
  const cleanName = hotelName.trim()
  
  // Check if city is already in the name
  const cityInName = cleanName.toLowerCase().includes(city.toLowerCase())
  
  // Start with hotel name
  let title = cleanName
  
  // Try to add brand if available and it fits
  if (brand && brand.trim()) {
    const brandSeparator = title.includes(',') ? ' | ' : ', '
    const withBrand = `${title}${brandSeparator}${brand.trim()}`
    
    if (withBrand.length <= 60) {
      title = withBrand
    }
  }
  
  // If no brand was added or it didn't fit, add city if not already present
  if (!cityInName && !title.includes(city)) {
    const citySeparator = title.includes(',') ? ' | ' : ', '
    const withCity = `${title}${citySeparator}${city}`
    
    if (withCity.length <= 60) {
      title = withCity
    }
  }
  
  // Ensure we never exceed 60 characters
  if (title.length > 60) {
    // If too long, try hotel name + city only
    const fallback = `${cleanName}, ${city}`
    title = fallback.length <= 60 ? fallback : cleanName.substring(0, 60)
  }
  
  // Remove any trailing commas that might have been left from truncation
  title = title.replace(/,\s*$/, '').trim()
  
  // Convert to title case (capitalize significant words)
  return title
    .split(' ')
    .map(word => {
      // Skip common words that shouldn't be capitalized
      const skipWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'of', 'on', 'or', 'the', 'to', 'up', 'yet']
      if (skipWords.includes(word.toLowerCase())) {
        return word.toLowerCase()
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join(' ')
}

// Function to generate SEO description following the specified rules
function generateSeoDescription(data: any, hotelName: string): string {
  // Extract city from address
  let city = 'Toronto' // default
  if (data.address) {
    const cityMatch = data.address.match(/([^,]+),\s*([A-Z]{2})/)
    if (cityMatch) {
      city = cityMatch[1].trim()
    }
  }
  
  // Extract star class and rating
  const starClass = data.extracted_hotel_class || (data.hotel_class ? parseInt(data.hotel_class) : null)
  const rating = data.overall_rating
  
  // Extract amenities from detailed groups first, then fallback to simple amenities
  const amenities: string[] = []
  
  // Check for detailed amenities
  if (data.amenities_detailed && Array.isArray(data.amenities_detailed.groups)) {
    data.amenities_detailed.groups.forEach((group: any) => {
      if (group.list && Array.isArray(group.list)) {
        group.list.forEach((item: any) => {
          if (item.title && item.available === true) {
            const title = item.title.toLowerCase()
            if (title.includes('wifi') || title.includes('internet')) {
              amenities.push('free Wi-Fi')
            } else if (title.includes('fitness') || title.includes('gym')) {
              amenities.push('fitness center')
            } else if (title.includes('pool')) {
              amenities.push('pool')
            } else if (title.includes('breakfast')) {
              const feeText = item.extra_charge ? ' (extra charge)' : ''
              amenities.push(`breakfast${feeText}`)
            } else if (title.includes('pet')) {
              const feeText = item.extra_charge ? ' (fees apply)' : ''
              amenities.push(`pet-friendly${feeText}`)
            } else if (title.includes('parking') || title.includes('valet')) {
              const feeText = item.extra_charge ? ' (fees apply)' : ''
              amenities.push(`parking${feeText}`)
            }
          }
        })
      }
    })
  }
  
  // Fallback to simple amenities if no detailed ones found
  if (amenities.length === 0 && data.amenities && Array.isArray(data.amenities)) {
    data.amenities.forEach((amenity: string) => {
      const lowerAmenity = amenity.toLowerCase()
      if (lowerAmenity.includes('wifi') || lowerAmenity.includes('internet')) {
        amenities.push('free Wi-Fi')
      } else if (lowerAmenity.includes('fitness') || lowerAmenity.includes('gym')) {
        amenities.push('fitness center')
      } else if (lowerAmenity.includes('pool')) {
        amenities.push('pool')
      } else if (lowerAmenity.includes('breakfast')) {
        amenities.push('breakfast')
      } else if (lowerAmenity.includes('pet')) {
        amenities.push('pet-friendly')
      } else if (lowerAmenity.includes('parking')) {
        amenities.push('parking')
      }
    })
  }
  
  // Remove duplicates and limit to 3 amenities
  const uniqueAmenities = Array.from(new Set(amenities)).slice(0, 3)
  
  // Extract nearby place
  let nearbyPlace = ''
  if (data.nearby_places && Array.isArray(data.nearby_places) && data.nearby_places.length > 0) {
    const recognizablePlaces = ['CN Tower', 'Royal Ontario Museum', 'ROM', 'Eaton Centre', 'Airport', 'Downtown']
    for (const place of data.nearby_places) {
      if (place.name && recognizablePlaces.some(recognizable => place.name.includes(recognizable))) {
        nearbyPlace = `near ${place.name}`
        break
      }
    }
  }
  
  // Build the description
  let description = `${hotelName} in ${city}`
  
  // Add star class or rating (prefer star class if both available)
  if (starClass) {
    description += `. ${starClass}-star`
  } else if (rating) {
    description += `. ${rating}/5`
  }
  
  // Add amenities
  if (uniqueAmenities.length > 0) {
    description += ` with ${uniqueAmenities.join(', ')}`
  }
  
  // Add nearby place
  if (nearbyPlace) {
    description += `, ${nearbyPlace}`
  }
  
  // Add eco-certified if applicable
  if (data.eco_certified === true) {
    description += ', eco-certified'
  }
  
  // Add CTA if space allows
  if (description.length < 140) {
    description += '. Book direct'
  }
  
  // Ensure we don't exceed 160 characters
  if (description.length > 160) {
    // Remove CTA first
    description = description.replace('. Book direct', '')
    
    // If still too long, remove nearby place
    if (description.length > 160 && nearbyPlace) {
      description = description.replace(`, ${nearbyPlace}`, '')
    }
    
    // If still too long, remove lowest priority amenity
    if (description.length > 160 && uniqueAmenities.length > 1) {
      const withoutLastAmenity = uniqueAmenities.slice(0, -1)
      description = description.replace(` with ${uniqueAmenities.join(', ')}`, ` with ${withoutLastAmenity.join(', ')}`)
    }
    
    // Final truncation if needed
    if (description.length > 160) {
      description = description.substring(0, 157) + '...'
    }
  }
  
  return description
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
    const { property_token, originalQuery } = body

    // Security: Input validation
    if (!property_token || typeof property_token !== 'string' || property_token.length > 100) {
      return NextResponse.json({
        success: false,
        error: 'Invalid property_token'
      }, { status: 400 })
    }

    if (originalQuery && (typeof originalQuery !== 'string' || originalQuery.length > 200)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid originalQuery'
      }, { status: 400 })
    }

    // Generate dynamic dates (today and tomorrow)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const checkInDate = today.toISOString().split('T')[0] // YYYY-MM-DD
    const checkOutDate = tomorrow.toISOString().split('T')[0] // YYYY-MM-DD

    // Security: Use environment variable directly and validate URL
    const serpApiUrl = `https://serpapi.com/search.json?engine=google_hotels&q=${encodeURIComponent(originalQuery || '')}&property_token=${encodeURIComponent(property_token)}&check_in_date=${checkInDate}&check_out_date=${checkOutDate}&gl=ca&hl=en&api_key=${process.env.SERPAPI_KEY}`

    // console.log('Fetching details with URL:', serpApiUrl)

    const response = await fetch(serpApiUrl)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(`SerpAPI error: ${data.error || 'Unknown error'}`)
    }

    // Debug: Log the response structure
    // console.log('Details Response Keys:', Object.keys(data))
    // console.log('Full details response preview:', JSON.stringify(data, null, 2).substring(0, 1000))

    // Extract detailed hotel information
    let hotelDetails = null

    // For Google Hotels with property_token, the response should contain the hotel details directly
    if (data.name && data.property_token) {
      // Extract brand information from the hotel name or link
      let brand = undefined
      const name = data.name || ''
      
      // Try to extract brand from common patterns
      if (name.includes('Curio Collection by Hilton')) {
        brand = 'Curio Collection by Hilton'
      } else if (name.includes('Hilton')) {
        brand = 'Hilton'
      } else if (name.includes('Marriott')) {
        brand = 'Marriott'
      } else if (name.includes('Hyatt')) {
        brand = 'Hyatt'
      } else if (name.includes('InterContinental')) {
        brand = 'InterContinental'
      } else if (name.includes('Kimpton')) {
        brand = 'Kimpton'
      } else if (name.includes('Four Seasons')) {
        brand = 'Four Seasons'
      } else if (name.includes('Ritz-Carlton')) {
        brand = 'Ritz-Carlton'
      } else if (name.includes('Fairmont')) {
        brand = 'Fairmont'
      } else if (name.includes('Westin')) {
        brand = 'Westin'
      } else if (name.includes('Sheraton')) {
        brand = 'Sheraton'
      }
      
      // Clean the hotel name by removing the brand if it's at the end
      let cleanName = name
      if (brand && name.endsWith(brand)) {
        cleanName = name.replace(new RegExp(`\\s*${brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`), '').trim()
      }
      
      // Remove any trailing commas from the hotel name
      cleanName = cleanName.replace(/,\s*$/, '').trim()
      
      // Extract the best available image URL
      let primaryImageUrl = ''
      if (data.images && Array.isArray(data.images) && data.images.length > 0) {
        // Try to get the original image URL from the first image
        const firstImage = data.images[0]
        primaryImageUrl = firstImage.original || firstImage.url || firstImage.src || ''
      }
      
      // Fallback to thumbnail if no image found
      if (!primaryImageUrl && data.thumbnail) {
        primaryImageUrl = data.thumbnail
      }
      
      hotelDetails = {
        name: cleanName,
        rating: data.overall_rating || data.rating,
        hotel_class: data.extracted_hotel_class || data.hotel_class,
        address: data.address,
        phone: data.phone,
        website: data.link || data.website,
        property_token: data.property_token,
        thumbnail: data.images?.[0]?.original || data.thumbnail,
        amenities: data.amenities || [],
        description: data.description,
        latitude: data.gps_coordinates?.latitude || data.latitude,
        longitude: data.gps_coordinates?.longitude || data.longitude,
        // Additional CMS fields with defaults
        city: 'Toronto', // Default to Toronto
        area: '', // Will be extracted from address
        seoTitle: generateSeoTitle(cleanName, brand, 'Toronto'),
        seoDescription: generateSeoDescription(data, cleanName),
        tags: [], // Will be populated based on amenities and location
        isActive: true,
        bookingLinks: [],
        primaryImageUrl: primaryImageUrl
      }
    }

    if (!hotelDetails) {
      return NextResponse.json({
        success: false,
        error: 'Could not extract hotel details from response'
      }, { status: 400 })
    }

    // console.log('Extracted hotel details:', hotelDetails.name)

    return NextResponse.json({
      success: true,
      hotel: hotelDetails,
      rawData: data
    })

  } catch (error) {
    // Security: Don't expose internal errors to client
    console.error('Error fetching hotel details:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch hotel details'
    }, { status: 500 })
  }
}
