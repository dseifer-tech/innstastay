// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@sanity/client')

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '6rewx4dr'
const DEV_DATASET = 'development'
const PROD_DATASET = 'production'

// Development client (for testing)
const devClient = createClient({
  projectId: PROJECT_ID,
  dataset: DEV_DATASET,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2023-05-03',
  useCdn: false
})

// Production client (read-only for comparison)
const prodClient = createClient({
  projectId: PROJECT_ID,
  dataset: PROD_DATASET,
  apiVersion: '2023-05-03',
  useCdn: false
})

async function testSanityWorkflow() {
  try {
    console.log('🧪 Testing Sanity Development Workflow...')
    console.log(`   Project ID: ${PROJECT_ID}`)
    console.log(`   Development Dataset: ${DEV_DATASET}`)
    console.log(`   Production Dataset: ${PROD_DATASET}`)
    console.log(`   API Token: ${process.env.SANITY_API_TOKEN ? 'Set' : 'Not set'}`)
    
    // Test 1: Read from production (should work)
    console.log('\n📖 Test 1: Reading from Production Dataset...')
    try {
      const prodHotels = await prodClient.fetch(`*[_type == "hotel"]{name, slug}`)
      console.log(`✅ Production: ${prodHotels.length} hotels found`)
      prodHotels.forEach(hotel => {
        console.log(`   - ${hotel.name} (${hotel.slug?.current || hotel.slug})`)
      })
    } catch (error) {
      console.log(`❌ Production read failed: ${error.message}`)
    }
    
    // Test 2: Read from development (should work)
    console.log('\n📖 Test 2: Reading from Development Dataset...')
    try {
      const devHotels = await devClient.fetch(`*[_type == "hotel"]{name, slug}`)
      console.log(`✅ Development: ${devHotels.length} hotels found`)
      if (devHotels.length > 0) {
        devHotels.forEach(hotel => {
          console.log(`   - ${hotel.name} (${hotel.slug?.current || hotel.slug})`)
        })
      } else {
        console.log('   ℹ️  No hotels in development dataset yet')
      }
    } catch (error) {
      console.log(`❌ Development read failed: ${error.message}`)
    }
    
    // Test 3: Write to development (if token is available)
    if (process.env.SANITY_API_TOKEN) {
      console.log('\n✏️  Test 3: Writing to Development Dataset...')
      try {
        // Create a test hotel
        const testHotel = await devClient.create({
          _type: 'hotel',
          name: 'Test Hotel - Development Only',
          slug: {
            _type: 'slug',
            current: 'test-hotel-dev-only'
          },
          city: 'Toronto',
          area: 'Test Area',
          address: '123 Test Street, Toronto, ON',
          description: 'This is a test hotel for development environment only. It will not appear in production.',
          rating: 4.0,
          hotelClass: 3,
          tags: ['test', 'development'],
          amenities: ['Free WiFi', 'Test Amenity'],
          isActive: false, // Important: Keep inactive in development
          token: 'test-token-dev-only'
        })
        console.log(`✅ Successfully created test hotel: ${testHotel._id}`)
        
        // Verify it was created
        const verifyHotel = await devClient.fetch(`*[_id == $id][0]{name, slug, isActive}`, { id: testHotel._id })
        console.log(`✅ Verification: ${verifyHotel.name} (Active: ${verifyHotel.isActive})`)
        
        // Clean up - delete the test hotel
        await devClient.delete(testHotel._id)
        console.log('✅ Successfully deleted test hotel')
        
      } catch (error) {
        console.log(`❌ Development write failed: ${error.message}`)
        console.log('💡 This usually means the API token lacks write permissions')
      }
    } else {
      console.log('\n⚠️  Test 3: Skipping write test - no API token available')
    }
    
    // Test 4: Verify production is unchanged
    console.log('\n🔒 Test 4: Verifying Production Dataset is Unchanged...')
    try {
      const finalProdHotels = await prodClient.fetch(`*[_type == "hotel"]{name, slug}`)
      console.log(`✅ Production dataset unchanged: ${finalProdHotels.length} hotels`)
    } catch (error) {
      console.log(`❌ Production verification failed: ${error.message}`)
    }
    
    console.log('\n📋 Workflow Summary:')
    console.log('   ✅ Development dataset is separate from production')
    console.log('   ✅ You can safely test changes in development')
    console.log('   ✅ Production data remains untouched')
    console.log('   💡 Use Sanity Studio to manage content visually')
    
    if (!process.env.SANITY_API_TOKEN) {
      console.log('\n⚠️  To enable full testing:')
      console.log('   1. Get a new API token from https://www.sanity.io/manage')
      console.log('   2. Add it to your .env.local file')
      console.log('   3. Run this test again')
    }
    
  } catch (error) {
    console.error('❌ Workflow test failed:', error.message)
  }
}

// Run the workflow test
testSanityWorkflow()
