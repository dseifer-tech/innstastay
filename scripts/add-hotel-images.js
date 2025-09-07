const { createClient } = require('@sanity/client')

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2023-05-03',
  useCdn: false
})

// Original hardcoded image data
const HOTEL_IMAGES = {
  "Pantages Hotel Downtown Toronto": "https://lh5.googleusercontent.com/p/AF1QipMt1ZolVWnJTgIMqogAUCjh9EldFh8vSDHY5TU=s10000",
  "Town Inn Suites": "https://lh5.googleusercontent.com/p/AF1QipN2HhQs9GSWKldSNWx_1o4EC3ojDlzgG9UVxgV1=s10000",
  "One King West Hotel & Residence": "https://lh5.googleusercontent.com/p/AF1QipPI-2hASi1fH2dzw3hOyxjk2UV9CVV9P3sKUYuX=s10000",
  "The Omni King Edward Hotel": "https://lh5.googleusercontent.com/p/AF1QipMvGKOVckX0M2FfmY-77Mt9eykQw6pHyHgmK067=s10000",
  "Chelsea Hotel, Toronto": "https://photos.hotelbeds.com/giata/original/04/049472/049472a_hb_f_004.JPG",
  "The Anndore House - JDV by Hyatt": "https://lh5.googleusercontent.com/p/AF1QipOh__jl8gimUkhS0FUaJSr1ft0-WORdu7KieteX=s10000",
  "Sutton Place Hotel Toronto": "https://lh5.googleusercontent.com/p/AF1QipPFImvLwmvVatoeTOPO-h4UCI53SGoH1ITu0BbY=s10000",
  "Ace Hotel Toronto": "https://lh5.googleusercontent.com/p/AF1QipNGix9dVAg06s82e08vaUXkAhqFlV2XPyTByWkj=s10000"
}

async function addHotelImages() {
  try {
    console.log('🔍 Fetching existing hotels...')
    
    // Get all hotels
    const hotels = await client.fetch(`
      *[_type == "hotel"] {
        _id,
        name,
        slug,
        primaryImageUrl
      }
    `)
    
    console.log(`Found ${hotels.length} hotels to update`)
    
    // Update each hotel with missing image data
    for (const hotel of hotels) {
      const hotelName = hotel.name
      const imageUrl = HOTEL_IMAGES[hotelName]
      
      if (!imageUrl) {
        console.log(`⚠️  Missing image for: ${hotelName}`)
        continue
      }
      
      // Check if hotel already has a primary image URL
      if (hotel.primaryImageUrl) {
        console.log(`ℹ️  Hotel already has image URL: ${hotelName}`)
        continue
      }
      
      console.log(`📝 Adding image to: ${hotelName}`)
      
      // Prepare the update with primary image URL
      const updateData = {
        primaryImageUrl: imageUrl
      }
      
      // Update the hotel
      await client.patch(hotel._id).set(updateData).commit()
      console.log(`✅ Added image to: ${hotelName}`)
    }
    
    console.log('🎉 All hotel images added successfully!')
    
  } catch (error) {
    console.error('❌ Error adding hotel images:', error)
  }
}

// Run the update
addHotelImages()
