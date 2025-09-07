// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@sanity/client')

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '6rewx4dr'
const DEV_DATASET = 'development'
const PROD_DATASET = 'production'

// Production client (read access)
const prodClient = createClient({
  projectId: PROJECT_ID,
  dataset: PROD_DATASET,
  apiVersion: '2023-05-03',
  useCdn: false
})

// Development client (write access)
const devClient = createClient({
  projectId: PROJECT_ID,
  dataset: DEV_DATASET,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2023-05-03',
  useCdn: false
})

async function copyHotelsToDev() {
  try {
    console.log('🔄 Copying hotels from production to development...')
    
    if (!process.env.SANITY_API_TOKEN) {
      console.log('❌ SANITY_API_TOKEN is required for this operation')
      console.log('💡 Please add your API token to .env.local file')
      return
    }
    
    // Get all hotels from production
    console.log('📖 Fetching hotels from production...')
    const prodHotels = await prodClient.fetch(`
      *[_type == "hotel"] {
        _id,
        _type,
        name,
        slug,
        token,
        city,
        area,
        address,
        phone,
        rating,
        hotelClass,
        description,
        seoTitle,
        seoDescription,
        gpsCoordinates,
        images,
        primaryImage,
        primaryImageUrl,
        ogImage,
        tags,
        amenities,
        bookingLinks,
        isActive
      }
    `)
    
    console.log(`✅ Found ${prodHotels.length} hotels in production`)
    
    // Clear existing hotels in development dataset
    console.log('🧹 Clearing existing hotels in development dataset...')
    const existingHotels = await devClient.fetch(`*[_type == "hotel"]{_id}`)
    if (existingHotels.length > 0) {
      console.log(`Found ${existingHotels.length} existing hotels, deleting...`)
      for (const hotel of existingHotels) {
        await devClient.delete(hotel._id)
      }
      console.log('✅ Cleared existing hotels')
    }
    
    // Copy hotels to development dataset
    console.log('📝 Copying hotels to development dataset...')
    let successCount = 0
    let errorCount = 0
    
    for (const hotel of prodHotels) {
      try {
        // Remove _id to create new document
        const { _id, ...hotelData } = hotel
        
        // Create new hotel in development dataset
        const newHotel = await devClient.create({
          ...hotelData,
          isActive: false // Mark as inactive in development
        })
        
        console.log(`✅ Copied: ${hotel.name}`)
        successCount++
        
      } catch (error) {
        console.log(`❌ Failed to copy ${hotel.name}: ${error.message}`)
        errorCount++
      }
    }
    
    console.log('\n📊 Copy Summary:')
    console.log(`   ✅ Successfully copied: ${successCount} hotels`)
    console.log(`   ❌ Failed to copy: ${errorCount} hotels`)
    console.log(`   📍 Development dataset now has ${successCount} hotels`)
    
    if (successCount > 0) {
      console.log('\n🎉 Development environment is now populated!')
      console.log('💡 You can now test your application with real hotel data')
    }
    
  } catch (error) {
    console.error('❌ Error copying hotels:', error.message)
  }
}

// Run the copy operation
copyHotelsToDev()
