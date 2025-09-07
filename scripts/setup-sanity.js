#!/usr/bin/env node

const { createClient } = require('@sanity/client')

// Use environment variables for project configuration
const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2023-05-03',
  useCdn: false
})

// Hotel data extracted from your current codebase
const hotels = [
  {
    name: "Pantages Hotel Downtown Toronto",
    slug: "pantages-hotel-downtown-toronto",
    token: "ChUIuuHw2tTc5roDGgkvbS8wOGw0bHIQAQ",
    city: "Toronto",
    area: "Downtown",
    address: "200 Victoria Street, Toronto, ON M5B 1V8",
    rating: 4.2,
    hotelClass: 4,
    description: "Located in the heart of downtown Toronto, this boutique hotel offers modern amenities and easy access to major attractions. Perfect for business and leisure travelers.",
    seoTitle: "Pantages Hotel Downtown Toronto - Boutique Hotel in Downtown Toronto",
    seoDescription: "Stay at Pantages Hotel Downtown Toronto, a boutique hotel in the heart of downtown with modern amenities and easy access to major attractions.",
    tags: ["boutique", "downtown"],
    amenities: ["Free WiFi", "Restaurant", "Fitness Center", "Business Center"],
    bookingLinks: [
      {
        name: "Official Site",
        urlTemplate: "https://reservations.travelclick.com/102298?&adults={adults}&children={children}&rooms=1&datein={datein_mmddyyyy}&dateout={dateout_mmddyyyy}",
        isActive: true
      }
    ],
    isActive: true
  },
  {
    name: "Town Inn Suites",
    slug: "town-inn-suites",
    token: "ChgI-qf9yYXimbHBARoLL2cvMXRoeDAxemoQAQ",
    city: "Toronto",
    area: "Church-Wellesley Village",
    address: "620 Church Street, Toronto, ON M4Y 2G2",
    rating: 4.0,
    hotelClass: 3,
    description: "Spacious suites with full kitchens, ideal for extended stays. Located in the vibrant Church-Wellesley Village, close to shopping and dining.",
    seoTitle: "Town Inn Suites - Extended Stay Suites in Toronto",
    seoDescription: "Town Inn Suites offers spacious suites with full kitchens, perfect for extended stays in Toronto's Church-Wellesley Village.",
    tags: ["extended_stay", "family_friendly"],
    amenities: ["Free WiFi", "Kitchen", "Free Breakfast", "Pool"],
    bookingLinks: [
      {
        name: "Official Site",
        urlTemplate: "https://www.towninn.com/book/accommodations?adults={adults}&children={children}&datein={datein_mmddyyyy}&dateout={dateout_mmddyyyy}&rooms=1",
        isActive: true
      }
    ],
    isActive: true
  },
  {
    name: "One King West Hotel & Residence",
    slug: "one-king-west-hotel-residence",
    token: "ChYIu__-9drx1LbWARoJL20vMDhjNGJ2EAE",
    city: "Toronto",
    area: "Financial District",
    address: "1 King Street West, Toronto, ON M5H 1A1",
    rating: 4.4,
    hotelClass: 4,
    description: "Historic building with modern luxury, featuring stunning city views and premium amenities. Located in the financial district.",
    seoTitle: "One King West Hotel & Residence - Luxury Hotel in Financial District",
    seoDescription: "Experience luxury at One King West Hotel & Residence, a historic building with modern amenities in Toronto's Financial District.",
    tags: ["luxury", "business", "financial_district"],
    amenities: ["Free WiFi", "Restaurant", "Spa", "Concierge"],
    bookingLinks: [
      {
        name: "Official Site",
        urlTemplate: "https://reservations.travelclick.com/95964?&adults={adults}&children={children}&rooms=1&datein={datein_mmddyyyy}&dateout={dateout_mmddyyyy}",
        isActive: true
      }
    ],
    isActive: true
  },
  {
    name: "The Omni King Edward Hotel",
    slug: "the-omni-king-edward-hotel",
    token: "ChYIkv69nuv-zoT7ARoJL20vMDhoeTJrEAE",
    city: "Toronto",
    area: "Downtown",
    address: "37 King Street East, Toronto, ON M5C 1E9",
    rating: 4.3,
    hotelClass: 5,
    description: "Toronto's most prestigious hotel, offering classic elegance and world-class service. Historic landmark with modern luxury.",
    seoTitle: "The Omni King Edward Hotel - Luxury Historic Hotel in Toronto",
    seoDescription: "Stay at The Omni King Edward Hotel, Toronto's most prestigious hotel offering classic elegance and world-class service.",
    tags: ["luxury", "downtown"],
    amenities: ["Free WiFi", "Restaurant", "Spa", "Historic Building"],
    bookingLinks: [
      {
        name: "Official Site",
        urlTemplate: "https://bookings.omnihotels.com/rates-room1?hotel=110052&arrival={checkin_dash}&departure={checkout_dash}&nights=1&rooms=1&adults[1]={adults}&children[1]={children}&ratePlanCategory=&language=en-us",
        isActive: true
      }
    ],
    isActive: true
  },
  {
    name: "Chelsea Hotel, Toronto",
    slug: "chelsea-hotel-toronto",
    token: "ChkIqY3kqoyj49-pARoML2cvMWhjMnpocnZ4EAE",
    city: "Toronto",
    area: "Downtown",
    address: "33 Gerrard Street West, Toronto, ON M5G 1Z4",
    rating: 4.1,
    hotelClass: 4,
    description: "Family-friendly hotel with indoor pool and rooftop garden. Located in the heart of downtown with easy access to attractions.",
    seoTitle: "Chelsea Hotel, Toronto - Family-Friendly Hotel in Downtown",
    seoDescription: "Chelsea Hotel, Toronto offers family-friendly accommodations with indoor pool and rooftop garden in downtown Toronto.",
    tags: ["family_friendly", "downtown"],
    amenities: ["Free WiFi", "Restaurant", "Pool", "Kids Club"],
    bookingLinks: [
      {
        name: "Official Site",
        urlTemplate: "https://reservation.brilliantbylangham.com/?a&adult={adults}&arrive={checkin_dash}&chain=10316&child={children}&config=brilliant&currency=CAD&depart={checkout_dash}&hotel=59052&level=hotel&locale=en-US&productcurrency=CAD&rooms=1&theme=brilliant",
        isActive: true
      }
    ],
    isActive: true
  },
  {
    name: "The Anndore House - JDV by Hyatt",
    slug: "the-anndore-house-jdv",
    token: "ChoIhpvZ14Ln1MShARoNL2cvMTFnOW1mbTB3ZhAB",
    city: "Toronto",
    area: "Yorkville",
    address: "15 Charles Street East, Toronto, ON M4Y 1S1",
    rating: 4.2,
    hotelClass: 4,
    description: "Boutique hotel with unique design and local character. Located in the trendy Yorkville neighborhood.",
    seoTitle: "The Anndore House - JDV by Hyatt - Boutique Hotel in Yorkville",
    seoDescription: "The Anndore House - JDV by Hyatt is a boutique hotel with unique design in Toronto's trendy Yorkville neighborhood.",
    tags: ["boutique", "yorkville"],
    amenities: ["Free WiFi", "Restaurant", "Bar", "Boutique Hotel"],
    bookingLinks: [
      {
        name: "Official Site",
        urlTemplate: "https://www.hyatt.com/shop/rooms/torjd?rooms=1&checkinDate={checkin_dash}&checkoutDate={checkout_dash}",
        isActive: true
      }
    ],
    isActive: true
  },
  {
    name: "Sutton Place Hotel Toronto",
    slug: "sutton-place-hotel-toronto",
    token: "ChkI6ffjk7GsktVCGg0vZy8xMW5tbF9objJwEAE",
    city: "Toronto",
    area: "Downtown",
    address: "955 Bay Street, Toronto, ON M5S 2A2",
    rating: 4.0,
    hotelClass: 4,
    description: "Upscale hotel with sophisticated amenities and excellent dining options. Perfect for business and leisure travelers.",
    seoTitle: "Sutton Place Hotel Toronto - Upscale Hotel in Downtown",
    seoDescription: "Sutton Place Hotel Toronto offers upscale accommodations with sophisticated amenities in downtown Toronto.",
    tags: ["downtown"],
    amenities: ["Free WiFi", "Restaurant", "Fitness Center", "Downtown Location"],
    bookingLinks: [
      {
        name: "Official Site",
        urlTemplate: "https://reservations.travelclick.com/114627?&adults={adults}&children={children}&rooms=1&datein={datein_mmddyyyy}&dateout={dateout_mmddyyyy}",
        isActive: true
      }
    ],
    isActive: true
  },
  {
    name: "Ace Hotel Toronto",
    slug: "ace-hotel-toronto",
    token: "ChkI2N-3xo2i371FGg0vZy8xMXJzYzM2X2hmEAE",
    city: "Toronto",
    area: "Entertainment District",
    address: "51 Camden Street, Toronto, ON M5V 1V2",
    rating: 4.3,
    hotelClass: 4,
    description: "Contemporary design hotel with artistic flair and cultural programming. Located in the vibrant Entertainment District.",
    seoTitle: "Ace Hotel Toronto - Contemporary Design Hotel in Entertainment District",
    seoDescription: "Ace Hotel Toronto is a contemporary design hotel with artistic flair in Toronto's vibrant Entertainment District.",
    tags: ["boutique", "entertainment_district"],
    amenities: ["Free WiFi", "Restaurant", "Bar", "Art Gallery"],
    bookingLinks: [
      {
        name: "Official Site",
        urlTemplate: "https://reservations.acehotel.com/?adult={adults}&arrive={checkin_dash}&chain=7231&child={children}&currency=CAD&depart={checkout_dash}&dest=ACE&hotel=36680&level=hotel&locale=en-US&productcurrency=CAD&rooms=1",
        isActive: true
      }
    ],
    isActive: true
  }
]

async function migrateHotels() {
  console.log('Starting hotel migration to Sanity...')
  
  for (const hotel of hotels) {
    try {
      // Create the hotel document
      const doc = await client.create({
        _type: 'hotel',
        ...hotel,
        slug: {
          _type: 'slug',
          current: hotel.slug
        }
      })
      console.log(`✅ Created hotel: ${hotel.name} with ID: ${doc._id}`)
    } catch (error) {
      console.error(`❌ Error creating ${hotel.name}:`, error.message)
    }
  }
  
  console.log('Migration completed!')
}

async function checkConnection() {
  try {
    const result = await client.fetch('count(*[_type == "hotel"])')
    console.log(`✅ Connected to Sanity! Found ${result} existing hotels.`)
    return true
  } catch (error) {
    console.error('❌ Failed to connect to Sanity:', error.message)
    console.log('\nPlease check:')
    console.log('1. Your PROJECT_ID is correct')
    console.log('2. Your SANITY_API_TOKEN is set correctly')
    console.log('3. You have created the hotel schema in Sanity Studio')
    return false
  }
}

async function main() {
  console.log('🔧 Sanity Setup Script for InnstaStay')
  console.log('=====================================\n')
  
  if (!PROJECT_ID) {
    console.log('❌ NEXT_PUBLIC_SANITY_PROJECT_ID environment variable is not set')
    console.log('Please check your .env.local file')
    return
  }
  
  console.log(`📋 Project ID: ${PROJECT_ID}`)
  console.log(`📋 Dataset: ${DATASET}`)
  
  const connected = await checkConnection()
  if (!connected) {
    return
  }
  
  console.log('\n🚀 Starting migration...')
  await migrateHotels()
}

main().catch(console.error)
