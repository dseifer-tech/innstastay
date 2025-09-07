const { createClient } = require('@sanity/client')

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '6rewx4dr'
const DEV_DATASET = 'development'
const PROD_DATASET = 'production'

// Development client (read-only for production)
const devClient = createClient({
  projectId: PROJECT_ID,
  dataset: DEV_DATASET,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2023-05-03',
  useCdn: false
})

// Production client (write access)
const prodClient = createClient({
  projectId: PROJECT_ID,
  dataset: PROD_DATASET,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2023-05-03',
  useCdn: false
})

async function approveContent() {
  try {
    console.log('🔍 Checking development dataset...')
    
    // Check if development dataset exists
    let devHotels
    try {
      devHotels = await devClient.fetch(`
        *[_type == "hotel"] {
          _id,
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
    } catch (error) {
      if (error.message.includes('Dataset not found')) {
        console.log('❌ Development dataset does not exist')
        console.log('💡 This script is designed to approve content from development to production')
        console.log('💡 To use this script:')
        console.log('   1. Create a development dataset in Sanity')
        console.log('   2. Add content to the development dataset')
        console.log('   3. Run this script to approve it to production')
        console.log('\n📋 Current status: Only production dataset exists')
        console.log('💡 If you want to manage production content directly, use other scripts')
        return
      } else {
        throw error
      }
    }
    
    console.log(`Found ${devHotels.length} hotels in development dataset`)
    
    // Get existing hotels from production
    const prodHotels = await prodClient.fetch(`
      *[_type == "hotel"] {
        _id,
        name,
        slug
      }
    `)
    
    console.log(`Found ${prodHotels.length} hotels in production dataset`)
    
    // Create a map of production hotels by slug
    const prodHotelMap = new Map()
    prodHotels.forEach(hotel => {
      prodHotelMap.set(hotel.slug.current, hotel._id)
    })
    
    let approvedCount = 0
    let createdCount = 0
    
    for (const devHotel of devHotels) {
      const slug = devHotel.slug.current
      const existingProdId = prodHotelMap.get(slug)
      
      if (existingProdId) {
        // Update existing hotel
        console.log(`📝 Updating: ${devHotel.name}`)
        await prodClient.patch(existingProdId).set(devHotel).commit()
        approvedCount++
      } else {
        // Create new hotel
        console.log(`➕ Creating: ${devHotel.name}`)
        await prodClient.create(devHotel)
        createdCount++
      }
    }
    
    console.log('🎉 Content approval completed!')
    console.log(`✅ Updated: ${approvedCount} hotels`)
    console.log(`✅ Created: ${createdCount} hotels`)
    console.log(`📊 Total processed: ${devHotels.length} hotels`)
    
  } catch (error) {
    console.error('❌ Error approving content:', error)
  }
}

// Run the approval
approveContent()
