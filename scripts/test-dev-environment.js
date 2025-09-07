// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@sanity/client')

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '6rewx4dr'
const DEV_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'development'

// Development client
const devClient = createClient({
  projectId: PROJECT_ID,
  dataset: DEV_DATASET,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2023-05-03',
  useCdn: false
})

async function testDevEnvironment() {
  try {
    console.log('🧪 Testing Development Environment...')
    console.log(`   Project ID: ${PROJECT_ID}`)
    console.log(`   Dataset: ${DEV_DATASET}`)
    console.log(`   API Token: ${process.env.SANITY_API_TOKEN ? 'Set' : 'Not set'}`)
    
    // Test reading from development dataset
    console.log('\n📖 Testing read access...')
    const hotels = await devClient.fetch(`*[_type == "hotel"]{name, slug}`)
    console.log(`✅ Successfully read ${hotels.length} hotels from development dataset`)
    
    // Test writing to development dataset (if token is available)
    if (process.env.SANITY_API_TOKEN) {
      console.log('\n✏️  Testing write access...')
      try {
        // Create a test document
        const testDoc = await devClient.create({
          _type: 'hotel',
          name: 'Test Hotel - Development',
          slug: {
            _type: 'slug',
            current: 'test-hotel-dev'
          },
          city: 'Toronto',
          address: '123 Test Street',
          description: 'This is a test hotel for development environment',
          isActive: false // Mark as inactive so it doesn't show in production
        })
        console.log(`✅ Successfully created test document: ${testDoc._id}`)
        
        // Clean up - delete the test document
        await devClient.delete(testDoc._id)
        console.log('✅ Successfully deleted test document')
        
      } catch (writeError) {
        console.log(`❌ Write test failed: ${writeError.message}`)
      }
    } else {
      console.log('\n⚠️  Skipping write test - no API token available')
    }
    
    console.log('\n🎉 Development environment test completed!')
    
  } catch (error) {
    console.error('❌ Development environment test failed:', error.message)
  }
}

// Run the test
testDevEnvironment()
