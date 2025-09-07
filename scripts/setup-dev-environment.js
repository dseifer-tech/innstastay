const { createClient } = require('@sanity/client')

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '6rewx4dr'
const DEV_DATASET = 'development'
const PROD_DATASET = 'production'

// Production client (read access)
const prodClient = createClient({
  projectId: PROJECT_ID,
  dataset: PROD_DATASET,
  token: process.env.SANITY_API_TOKEN,
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

async function setupDevEnvironment() {
  try {
    console.log('🔍 Fetching hotels from production dataset...')
    
    // Get all hotels from production
    const prodHotels = await prodClient.fetch(`
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
    
    console.log(`✅ Found ${prodHotels.length} hotels in production dataset:`)
    prodHotels.forEach(hotel => {
      console.log(`  - ${hotel.name} (${hotel.slug?.current || hotel.slug})`)
    })
    
    // Check if development dataset exists
    console.log('\n🔍 Checking if development dataset exists...')
    let hasDevDataset = false
    
    try {
      await devClient.fetch(`*[_type == "hotel"]{_id}`)
      hasDevDataset = true
      console.log('✅ Development dataset exists')
    } catch (error) {
      if (error.message.includes('Dataset not found')) {
        console.log('❌ Development dataset does not exist')
        console.log('💡 To create a development dataset:')
        console.log('   1. Go to https://www.sanity.io/manage')
        console.log('   2. Select your project (6rewx4dr)')
        console.log('   3. Go to "Datasets" tab')
        console.log('   4. Click "Create dataset"')
        console.log('   5. Name it "development"')
        console.log('   6. Set it as a copy of "production"')
      } else {
        console.log(`❌ Error checking development dataset: ${error.message}`)
      }
    }
    
    // Check API token permissions
    console.log('\n🔍 Checking API token permissions...')
    if (!process.env.SANITY_API_TOKEN) {
      console.log('❌ SANITY_API_TOKEN environment variable is not set')
      console.log('💡 You need to set this environment variable with a token that has write permissions')
    } else {
      console.log('✅ SANITY_API_TOKEN is set')
      if (!hasDevDataset) {
        console.log('⚠️  Cannot test write permissions without a development dataset')
      }
    }
    
    console.log('\n📋 Summary:')
    console.log(`   - Production dataset: ${prodHotels.length} hotels available`)
    console.log(`   - Development dataset: ${hasDevDataset ? 'Exists' : 'Does not exist'}`)
    console.log(`   - API Token: ${process.env.SANITY_API_TOKEN ? 'Set' : 'Not set'}`)
    
    if (!hasDevDataset) {
      console.log('\n💡 Next steps:')
      console.log('   1. Create a development dataset in Sanity')
      console.log('   2. Ensure your API token has write permissions')
      console.log('   3. Run this script again')
    }
    
  } catch (error) {
    console.error('❌ Error setting up development environment:', error.message)
  }
}

// Run the setup
setupDevEnvironment()
