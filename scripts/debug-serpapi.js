#!/usr/bin/env node

/**
 * Local SerpAPI Debugger
 * 
 * Usage:
 *   node scripts/debug-serpapi.js
 *   node scripts/debug-serpapi.js --hotel="fairmont royal york"
 *   node scripts/debug-serpapi.js --checkin=2024-12-15 --checkout=2024-12-16
 */

require('dotenv').config();

const SERPAPI_KEY = process.env.SERPAPI_KEY;

if (!SERPAPI_KEY) {
  console.error('❌ SERPAPI_KEY not found in environment variables');
  process.exit(1);
}

// Parse command line arguments
const args = process.argv.slice(2);
const params = {};
args.forEach(arg => {
  const [key, value] = arg.split('=');
  if (key.startsWith('--')) {
    params[key.slice(2)] = value;
  }
});

// Default search parameters
const searchParams = {
  hotel: params.hotel || 'fairmont royal york toronto',
  checkin: params.checkin || '2024-12-15',
  checkout: params.checkout || '2024-12-16',
  adults: params.adults || '2',
  children: params.children || '0',
  rooms: params.rooms || '1'
};

console.log('🔍 SerpAPI Debug Session Starting...');
console.log('📅 Search Parameters:', searchParams);
console.log('🔑 API Key:', SERPAPI_KEY.substring(0, 10) + '...');
console.log('─'.repeat(80));

async function debugSerpAPI() {
  try {
    const url = new URL('https://serpapi.com/search');
    url.searchParams.set('engine', 'google_hotels');
    url.searchParams.set('q', searchParams.hotel);
    url.searchParams.set('check_in_date', searchParams.checkin);
    url.searchParams.set('check_out_date', searchParams.checkout);
    url.searchParams.set('adults', searchParams.adults);
    url.searchParams.set('children', searchParams.children);
    url.searchParams.set('rooms', searchParams.rooms);
    url.searchParams.set('currency', 'CAD');
    url.searchParams.set('api_key', SERPAPI_KEY);

    console.log('🌐 Request URL:', url.toString());
    console.log('─'.repeat(80));
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log('✅ Response Status:', response.status);
    console.log('📊 Response Size:', JSON.stringify(data).length, 'characters');
    console.log('─'.repeat(80));
    
    // Check for errors
    if (data.error) {
      console.error('❌ SerpAPI Error:', data.error);
      return;
    }
    
    // Display search metadata
    console.log('🔍 Search Info:');
    console.log('  Query:', data.search_parameters?.q || 'N/A');
    console.log('  Location:', data.search_parameters?.location || 'Auto');
    console.log('  Check-in:', data.search_parameters?.check_in_date);
    console.log('  Check-out:', data.search_parameters?.check_out_date);
    console.log('  Currency:', data.search_parameters?.currency || 'USD');
    console.log('─'.repeat(80));
    
    // Display properties found
    const properties = data.properties || [];
    console.log(`🏨 Found ${properties.length} Properties:`);
    
    if (properties.length === 0) {
      console.log('❌ No properties found. Try a different hotel name or dates.');
      return;
    }
    
    properties.forEach((property, index) => {
      console.log(`\n📍 Property ${index + 1}:`);
      console.log(`  Name: ${property.name || 'Unknown'}`);
      console.log(`  Type: ${property.type || 'N/A'}`);
      console.log(`  Rating: ${property.overall_rating || 'N/A'} (${property.reviews || 0} reviews)`);
      console.log(`  Location: ${property.neighborhood || property.description || 'N/A'}`);
      
      // Rate information
      if (property.rate_per_night) {
        console.log(`  💰 Rate: ${property.rate_per_night.lowest || 'N/A'}`);
        console.log(`  💱 Currency: ${property.rate_per_night.currency || 'N/A'}`);
        console.log(`  🏷️  Rate Type: ${property.rate_per_night.type || 'N/A'}`);
      } else {
        console.log(`  💰 Rate: No pricing available`);
      }
      
      // Booking options
      if (property.booking_option) {
        console.log(`  🔗 Booking: ${property.booking_option.title || 'Available'}`);
        console.log(`  💳 Price: ${property.booking_option.price || 'See rates'}`);
      }
      
      // Images
      if (property.images && property.images.length > 0) {
        console.log(`  📸 Images: ${property.images.length} available`);
      }
      
      // Amenities
      if (property.amenities) {
        console.log(`  🎯 Amenities: ${property.amenities.slice(0, 3).join(', ')}${property.amenities.length > 3 ? '...' : ''}`);
      }
    });
    
    console.log('\n' + '─'.repeat(80));
    console.log('🔧 Raw Data Structure:');
    console.log('Keys:', Object.keys(data));
    
    if (data.properties && data.properties[0]) {
      console.log('\n📋 First Property Keys:', Object.keys(data.properties[0]));
      
      if (data.properties[0].rate_per_night) {
        console.log('💰 Rate Per Night Keys:', Object.keys(data.properties[0].rate_per_night));
      }
    }
    
    // Save raw response for detailed inspection
    const fs = require('fs');
    const filename = `serpapi-debug-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    console.log(`\n📁 Raw response saved to: ${filename}`);
    console.log('🔍 Use this file to inspect the complete data structure');
    
  } catch (error) {
    console.error('❌ Debug Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Quick rate comparison helper
async function compareRates() {
  console.log('\n' + '='.repeat(80));
  console.log('💱 RATE COMPARISON TEST');
  console.log('='.repeat(80));
  
  const testHotels = [
    'fairmont royal york toronto',
    'shangri la toronto',
    'four seasons toronto'
  ];
  
  for (const hotel of testHotels) {
    console.log(`\n🏨 Testing: ${hotel}`);
    
    try {
      const url = new URL('https://serpapi.com/search');
      url.searchParams.set('engine', 'google_hotels');
      url.searchParams.set('q', hotel);
      url.searchParams.set('check_in_date', searchParams.checkin);
      url.searchParams.set('check_out_date', searchParams.checkout);
      url.searchParams.set('adults', '2');
      url.searchParams.set('api_key', SERPAPI_KEY);
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.properties && data.properties[0]) {
        const prop = data.properties[0];
        const rate = prop.rate_per_night?.lowest || 'No rate';
        const currency = prop.rate_per_night?.currency || '';
        console.log(`  💰 ${rate} ${currency}`);
      } else {
        console.log(`  ❌ No results found`);
      }
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Run the debugger
debugSerpAPI().then(() => {
  if (params.compare) {
    return compareRates();
  }
}).then(() => {
  console.log('\n✅ Debug session complete');
}).catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
