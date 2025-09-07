import { extractOfficialFeatured, extractOfficialFeaturedLegacy } from '../officialFeatured';

// Mock the core utilities for testing
jest.mock('@/lib/core/money', () => ({
  parseMoney: jest.fn()
}));

jest.mock('@/lib/core/img', () => ({
  toProxyUrl: jest.fn((url) => url)
}));

jest.mock('@/lib/core/log', () => ({
  log: {
    official: {
      debug: jest.fn()
    }
  }
}));

describe('extractOfficialFeatured', () => {
  it('should extract nightlyFrom and currency from Town Inn Suites data', () => {
    // Mock SerpAPI response for Town Inn Suites
    const mockSerpApiResponse = {
      currency: "CAD",
      featured_prices: [
        {
          official: true,
          rate_per_night: {
            extracted_before_taxes_fees: 555,
            extracted_lowest: 555
          },
          total_rate: {
            extracted_before_taxes_fees: 555,
            extracted_lowest: 555
          },
          link: "https://example.com/book",
          rooms: [
            {
              name: "Luxury 1 Bedroom Suite 2 Double - Flexible Rate",
              rate_per_night: {
                extracted_before_taxes_fees: 555,
                extracted_lowest: 555
              },
              images: ["https://example.com/room1.jpg"],
              link: "https://example.com/book/room1",
              refundable: true,
              cancellable: true,
              ratePlan: "Flexible Rate"
            },
            {
              name: "Luxury 1 Bedroom Suite 2 Double - Suite Breakfast Package",
              rate_per_night: {
                extracted_before_taxes_fees: 588,
                extracted_lowest: 588
              },
              images: ["https://example.com/room2.jpg"],
              link: "https://example.com/book/room2",
              refundable: true,
              cancellable: true,
              ratePlan: "Suite Breakfast Package"
            },
            {
              name: "Luxury Two Bedroom Suite - Flexible Rate",
              rate_per_night: {
                extracted_before_taxes_fees: 791,
                extracted_lowest: 791
              },
              images: ["https://example.com/room3.jpg"],
              link: "https://example.com/book/room3",
              refundable: true,
              cancellable: true,
              ratePlan: "Flexible Rate"
            },
            {
              name: "Luxury Two Bedroom Suite - Suite Breakfast Package",
              rate_per_night: {
                extracted_before_taxes_fees: 838,
                extracted_lowest: 838
              },
              images: ["https://example.com/room4.jpg"],
              link: "https://example.com/book/room4",
              refundable: true,
              cancellable: true,
              ratePlan: "Suite Breakfast Package"
            }
          ]
        }
      ]
    };

    const result = extractOfficialFeaturedLegacy(mockSerpApiResponse);

    // Assert headline pricing
    expect(result.nightlyFrom).toBe(555);
    expect(result.currency).toBe("CAD");
    expect(result.officialLink).toBe("https://example.com/book");

    // Assert rooms
    expect(result.rooms).toBeDefined();
    expect(result.rooms!.length).toBeGreaterThanOrEqual(4);

    // Assert first room matches headline pricing
    const firstRoom = result.rooms![0];
    expect(firstRoom.nightly).toBe(555);
    expect(firstRoom.currency).toBe("CAD");
    expect(firstRoom.image).toBe("https://example.com/room1.jpg");
    expect(firstRoom.link).toBe("https://example.com/book/room1");
    expect(firstRoom.name).toBe("Luxury 1 Bedroom Suite 2 Double - Flexible Rate");
    expect(firstRoom.refundable).toBe(true);
    expect(firstRoom.cancellable).toBe(true);
    expect(firstRoom.ratePlan).toBe("Flexible Rate");
  });

  it('should handle missing official featured price', () => {
    const mockResponse = {
      currency: "CAD",
      featured_prices: [
        {
          official: false,
          rate_per_night: {
            extracted_before_taxes_fees: 555
          }
        }
      ]
    };

    const result = extractOfficialFeaturedLegacy(mockResponse);

    expect(result.nightlyFrom).toBeUndefined();
    expect(result.currency).toBeUndefined();
    expect(result.rooms).toBeUndefined();
  });

  it('should handle missing rooms array', () => {
    const mockResponse = {
      currency: "CAD",
      featured_prices: [
        {
          official: true,
          rate_per_night: {
            extracted_before_taxes_fees: 555
          },
          link: "https://example.com/book"
        }
      ]
    };

    const result = extractOfficialFeaturedLegacy(mockResponse);

    expect(result.nightlyFrom).toBe(555);
    expect(result.currency).toBe("CAD");
    expect(result.officialLink).toBe("https://example.com/book");
    expect(result.rooms).toBeUndefined();
  });
});
