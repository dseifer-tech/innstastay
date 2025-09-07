import { extractOfficialBest } from '../../lib/live/official';

// Test fixture JSONs
const testCases = [
  {
    name: "Featured prices only",
    json: {
      featured_prices: [
        {
          official: true,
          rate_per_night: { extracted_before_taxes_fees: 299 },
          link: "https://example.com/book",
          room: { name: "Deluxe Room" }
        }
      ],
      currency: "CAD"
    }
  },
  {
    name: "Prices array only",
    json: {
      prices: [
        {
          official: true,
          rate_per_night: { extracted_before_taxes_fees: 250 },
          link: "https://example.com/book",
          room: { name: "Standard Room" }
        }
      ],
      currency: "CAD"
    }
  },
  {
    name: "Both featured and prices - featured wins (lower)",
    json: {
      featured_prices: [
        {
          official: true,
          rate_per_night: { extracted_before_taxes_fees: 299 },
          link: "https://example.com/featured",
          room: { name: "Deluxe Room" }
        }
      ],
      prices: [
        {
          official: true,
          rate_per_night: { extracted_before_taxes_fees: 350 },
          link: "https://example.com/prices",
          room: { name: "Standard Room" }
        }
      ],
      currency: "CAD"
    }
  },
  {
    name: "Both featured and prices - prices wins (lower)",
    json: {
      featured_prices: [
        {
          official: true,
          rate_per_night: { extracted_before_taxes_fees: 400 },
          link: "https://example.com/featured",
          room: { name: "Deluxe Room" }
        }
      ],
      prices: [
        {
          official: true,
          rate_per_night: { extracted_before_taxes_fees: 299 },
          link: "https://example.com/prices",
          room: { name: "Standard Room" }
        }
      ],
      currency: "CAD"
    }
  },
  {
    name: "No official prices",
    json: {
      featured_prices: [
        {
          official: false,
          rate_per_night: { extracted_before_taxes_fees: 299 }
        }
      ],
      prices: [
        {
          official: false,
          rate_per_night: { extracted_before_taxes_fees: 250 }
        }
      ],
      currency: "CAD"
    }
  }
];

function runTests() {
  console.log('🧪 Testing new pricing extraction system...\n');
  
  testCases.forEach((testCase, index) => {
    console.log(`Test ${index + 1}: ${testCase.name}`);
    console.log('Input JSON:', JSON.stringify(testCase.json, null, 2));
    
    const result = extractOfficialBest(testCase.json);
    
    console.log('Result:', result ? {
      nightly_price: result.nightly_price,
      currency: result.currency,
      booking_link: result.booking_link,
      room_name: result.room.name,
      source: result.source,
      debug: result.debug
    } : 'null');
    
    console.log('---\n');
  });
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

export { runTests };
