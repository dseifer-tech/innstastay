#!/usr/bin/env node

/**
 * Hotel Search Flow Debugger
 * 
 * Tests the complete flow: Sanity → SerpAPI → Price Enrichment
 * 
 * Usage:
 *   node scripts/debug-hotel-search.js
 *   node scripts/debug-hotel-search.js --hotel=fairmont-royal-york
 *   node scripts/debug-hotel-search.js --checkin=2024-12-15 --checkout=2024-12-16
 */

require('dotenv').config();

// Parse command line arguments
const args = process.argv.slice(2);
const params = {};
args.forEach(arg => {
  const [key, value] = arg.split('=');
  if (key.startsWith('--')) {
    params[key.slice(2)] = value;
  }
});

const searchParams = {
  checkIn: params.checkin || '2024-12-15',
  checkOut: params.checkout || '2024-12-16',
  adults: parseInt(params.adults || '2'),
  children: parseInt(params.children || '0'),
  rooms: parseInt(params.rooms || '1'),
  city: params.city || 'toronto',
  hotelSlug: params.hotel || null // Optional: test specific hotel
};

console.log('🏨 Hotel Search Flow Debugger');
console.log('📅 Search Parameters:', searchParams);
console.log('─'.repeat(80));

async function debugHotelSearch() {
  try {
    // Step 1: Import hotel search functions (dynamic import for Node.js compatibility)
    console.log('📦 Loading hotel search modules...');
    
    // We'll simulate the flow since we can't directly import ES modules in this Node.js script
    // Instead, we'll call the actual API endpoints
    
    // Step 2: Test hotel data fetching
    console.log('\n🔍 Step 1: Fetching hotel data from Sanity...');
    
    const hotelResponse = await fetch(`http://localhost:3000/api/admin/hotels/search?city=${searchParams.city}`);
    if (!hotelResponse.ok) {
      console.log('⚠️  Local API not running. Starting manual SerpAPI test...');
      return await manualSerpAPITest();
    }
    
    const hotelData = await hotelResponse.json();
    console.log(`✅ Found ${hotelData.hotels?.length || 0} hotels in Sanity`);
    
    if (hotelData.hotels?.length > 0) {
      hotelData.hotels.slice(0, 3).forEach((hotel, i) => {
        console.log(`  ${i + 1}. ${hotel.name} (${hotel.slug?.current || hotel.slug})`);
      });
    }
    
    // Step 3: Test price enrichment for specific hotel
    const testHotel = searchParams.hotelSlug 
      ? hotelData.hotels?.find(h => h.slug?.current === searchParams.hotelSlug || h.slug === searchParams.hotelSlug)
      : hotelData.hotels?.[0];
    
    if (!testHotel) {
      console.log('❌ No test hotel found');
      return;
    }
    
    console.log(`\n🎯 Step 2: Testing price enrichment for "${testHotel.name}"`);
    console.log(`  Hotel slug: ${testHotel.slug?.current || testHotel.slug}`);
    console.log(`  Hotel token: ${testHotel.token || 'none'}`);
    
    // Step 4: Call price API
    const priceUrl = new URL('http://localhost:3000/api/price');
    priceUrl.searchParams.set('hotel', testHotel.token || testHotel.slug?.current || testHotel.slug);
    priceUrl.searchParams.set('checkin', searchParams.checkIn);
    priceUrl.searchParams.set('checkout', searchParams.checkOut);
    priceUrl.searchParams.set('adults', searchParams.adults.toString());
    priceUrl.searchParams.set('children', searchParams.children.toString());
    priceUrl.searchParams.set('rooms', searchParams.rooms.toString());
    
    console.log(`🌐 Price API URL: ${priceUrl.toString()}`);
    
    const priceResponse = await fetch(priceUrl);
    const priceData = await priceResponse.json();
    
    console.log(`📊 Price API Response (${priceResponse.status}):`);
    console.log('  Success:', priceData.success);
    console.log('  Error:', priceData.error || 'None');
    
    if (priceData.rates) {
      console.log('  💰 Rates found:', priceData.rates.length);
      priceData.rates.slice(0, 3).forEach((rate, i) => {
        console.log(`    ${i + 1}. ${rate.source}: ${rate.currency} ${rate.price} (${rate.type || 'standard'})`);
      });
      
      if (priceData.lowestRate) {
        console.log(`  🏆 Lowest Rate: ${priceData.lowestRate.currency} ${priceData.lowestRate.price} from ${priceData.lowestRate.source}`);
      }
    } else {
      console.log('  ❌ No rates returned');
    }
    
    // Step 5: Test complete search flow
    console.log(`\n🔄 Step 3: Testing complete search flow...`);
    
    const searchUrl = new URL('http://localhost:3000/search');
    searchUrl.searchParams.set('checkin', searchParams.checkIn);
    searchUrl.searchParams.set('checkout', searchParams.checkOut);
    searchUrl.searchParams.set('adults', searchParams.adults.toString());
    searchUrl.searchParams.set('children', searchParams.children.toString());
    searchUrl.searchParams.set('rooms', searchParams.rooms.toString());
    
    console.log(`🌐 Search Page URL: ${searchUrl.toString()}`);
    console.log('💡 Open this URL in your browser to see the full search results');
    
  } catch (error) {
    console.error('❌ Debug Error:', error.message);
    console.log('\n🔧 Falling back to manual SerpAPI test...');
    return await manualSerpAPITest();
  }
}

async function manualSerpAPITest() {
  console.log('\n🧪 Manual SerpAPI Test');
  console.log('─'.repeat(50));
  
  const SERPAPI_KEY = process.env.SERPAPI_KEY;
  if (!SERPAPI_KEY) {
    console.error('❌ SERPAPI_KEY not found in environment');
    return;
  }
  
  const testQueries = [
    'fairmont royal york toronto',
    'shangri la toronto',
    'four seasons toronto',
    'chelsea hotel toronto'
  ];
  
  for (const query of testQueries) {
    console.log(`\n🏨 Testing: ${query}`);
    
    try {
      const url = new URL('https://serpapi.com/search');
      url.searchParams.set('engine', 'google_hotels');
      url.searchParams.set('q', query);
      url.searchParams.set('check_in_date', searchParams.checkIn);
      url.searchParams.set('check_out_date', searchParams.checkOut);
      url.searchParams.set('adults', searchParams.adults.toString());
      url.searchParams.set('children', searchParams.children.toString());
      url.searchParams.set('currency', 'CAD');
      url.searchParams.set('api_key', SERPAPI_KEY);
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.error) {
        console.log(`  ❌ Error: ${data.error}`);
        continue;
      }
      
      if (data.properties && data.properties.length > 0) {
        const prop = data.properties[0];
        console.log(`  ✅ Found: ${prop.name}`);
        console.log(`  📍 Location: ${prop.neighborhood || 'N/A'}`);
        
        if (prop.rate_per_night) {
          console.log(`  💰 Rate: ${prop.rate_per_night.lowest || 'N/A'} ${prop.rate_per_night.currency || ''}`);
          console.log(`  🏷️  Type: ${prop.rate_per_night.type || 'N/A'}`);
        } else {
          console.log(`  💰 Rate: No pricing available`);
        }
        
        if (prop.booking_option) {
          console.log(`  🔗 Booking: ${prop.booking_option.price || 'See rates'}`);
        }
      } else {
        console.log(`  ❌ No properties found`);
      }
      
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
    }
    
    // Rate limiting delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Rate format comparison
function analyzeRateFormats() {
  console.log('\n📊 Common Rate Format Issues:');
  console.log('─'.repeat(40));
  console.log('❌ Common Problems:');
  console.log('  • "from $X" text instead of numeric values');
  console.log('  • Missing currency codes');
  console.log('  • Rates in wrong currency (USD vs CAD)');
  console.log('  • Tax inclusion ambiguity');
  console.log('  • Booking.com vs hotel direct rates');
  console.log('');
  console.log('✅ What to Look For:');
  console.log('  • rate_per_night.lowest should be numeric');
  console.log('  • rate_per_night.currency should be "CAD"');
  console.log('  • booking_option.price format');
  console.log('  • Multiple rate sources for comparison');
}

// Run the debugger
debugHotelSearch().then(() => {
  analyzeRateFormats();
  console.log('\n✅ Hotel search debug complete');
  console.log('💡 Use the generated JSON files to inspect raw API responses');
}).catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
