'use client';

import { useState } from 'react';
import MobileMenu from '@/app/components/MobileMenu';
import OptimizedImage from '@/app/components/OptimizedImage';
import { proxify } from '@/lib/img';

export default function DowntownPageClient() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Downtown Toronto Hotels
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover the best hotels in downtown Toronto with direct booking and no commission fees.
            </p>
          </div>
        </div>
      </section>

      {/* Neighborhoods Quick Links */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Popular Neighborhoods
            </h2>
            <p className="text-gray-600">
              Find hotels in Toronto&apos;s most sought-after downtown areas
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'Financial District',
              'Entertainment District', 
              'King West',
              'Yorkville',
              'Harbourfront',
              'Distillery District',
              'Queen West',
              'St. Lawrence'
            ].map((neighborhood) => (
              <a
                key={neighborhood}
                href={`/search?neighborhood=${neighborhood.toLowerCase().replace(/\s+/g, '-')}`}
                className="inline-flex items-center px-4 py-2 rounded-full border border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-colors text-sm font-medium"
              >
                {neighborhood}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Mini Guide Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Downtown Toronto Guide
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Must-visit attractions and landmarks within walking distance of downtown hotels
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* CN Tower */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">CN Tower</h3>
              <p className="text-gray-600 text-center mb-4">
                Toronto&apos;s iconic 553m tower with observation decks, EdgeWalk experience, and 360 Restaurant.
              </p>
              <div className="text-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                  5-10 min walk
                </span>
              </div>
            </div>

            {/* Royal Ontario Museum */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Royal Ontario Museum</h3>
              <p className="text-gray-600 text-center mb-4">
                World-class museum featuring natural history, world cultures, and the famous crystal architecture.
              </p>
              <div className="text-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                  15-20 min walk
                </span>
              </div>
            </div>

            {/* Harbourfront */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 12h18m-9 4.5c-4.5 0-8-2.5-8-5.5s3.5-5.5 8-5.5 8 2.5 8 5.5-3.5 5.5-8 5.5z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">Harbourfront</h3>
              <p className="text-gray-600 text-center mb-4">
                Waterfront district with Lake Ontario views, ferry to Toronto Islands, and cultural events.
              </p>
              <div className="text-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-sm font-medium">
                  10-15 min walk
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content continues... */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Featured Downtown Hotels
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
            Experience the heart of Toronto with our curated selection of premium downtown hotels. 
            Each property offers direct booking with transparent pricing and no hidden fees.
          </p>
          
          {/* Hotel listings would go here */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Hotel cards would be populated here */}
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
              <div className="aspect-video bg-gray-200 rounded-xl mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sample Hotel</h3>
              <p className="text-gray-600 mb-4">Located in the heart of downtown Toronto</p>
              <a href="/search" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                View Rates
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Why Downtown Toronto Icons Section */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M8 21h8m-4-4v4m-8-6V5a2 2 0 012-2h8a2 2 0 012 2v10"></path>
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800">Central & Walkable</h3>
              <p className="text-gray-600 text-sm mt-1">Stay near events, shopping, business hubs, and transit — all within walking distance.</p>
            </div>

            <div>
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 8c1.657 0 3 1.567 3 3.5S13.657 15 12 15s-3-1.567-3-3.5S10.343 8 12 8z"></path>
                  <path d="M12 3v5m0 10v3m7-10h-4m-6 0H5"></path>
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800">Real-Time Direct Prices</h3>
              <p className="text-gray-600 text-sm mt-1">Compare official rates pulled live from hotel booking engines — no commission, no middlemen.</p>
            </div>

            <div>
              <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9.75 17l.72 2.16a.75.75 0 001.42 0L12.59 17h4.66a.75.75 0 00.54-1.28l-3.87-4.01a.75.75 0 010-1.06l3.87-4.01a.75.75 0 00-.54-1.28h-4.66L11.89 4.84a.75.75 0 00-1.42 0L9.75 7H5.25a.75.75 0 00-.54 1.28l3.87 4.01a.75.75 0 010 1.06L4.71 17a.75.75 0 00.54 1.28h4.5z"></path>
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800">No Booking Fees</h3>
              <p className="text-gray-600 text-sm mt-1">We don&apos;t add fees. You book directly with the hotel and pay exactly what they charge.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Nearby Attractions Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
            Nearby Attractions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: "CN Tower",
                link: "https://www.google.com/search?q=CN+Tower",
                thumbnail: proxify("https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcToC6Dg8U9nucWiitonjOGkMhhIqrf6NalAdrVeYXaiQkDqBuDy", "CN Tower"),
                rating: 4.6,
                reviews: 81033,
                description: "Over 553-metre landmark tower with panoramic city views and a glass floor experience."
              },
              {
                name: "Royal Ontario Museum",
                link: "https://www.google.com/search?q=Royal+Ontario+Museum",
                thumbnail: proxify("https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTm301sIsH1CmyGx9hhuENMH3Ni1yzLZJvjE6iGGfo88sCYNTWw", "Royal Ontario Museum"),
                rating: 4.7,
                reviews: 39728,
                description: "Natural history and world cultures exhibits — including fossils, artifacts, and more."
              },
              {
                name: "Ripley's Aquarium of Canada",
                link: "https://www.google.com/search?q=Ripley's+Aquarium+of+Canada",
                thumbnail: proxify("https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQoCFpB93wBlMQcUqbnrBUM1I-BIS30KwpXkEZFawxcbOjHCqj_", "Ripley's Aquarium of Canada"),
                rating: 4.6,
                reviews: 64115,
                description: "Modern aquarium featuring diverse aquatic species, tunnel exhibits, and family-friendly events."
              },
              {
                name: "Art Gallery of Ontario",
                link: "https://www.google.com/search?q=Art+Gallery+of+Ontario",
                thumbnail: proxify("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH4mdIZfQ-6BC-k4mO9xxXPB-eYZd37_oe73iDacYf_JkhBscP", "Art Gallery of Ontario"),
                rating: 4.7,
                reviews: 17844,
                description: "One of North America's largest art museums with a major Canadian and European collection."
              },
              {
                name: "Casa Loma",
                link: "https://www.google.com/search?q=Casa+Loma",
                thumbnail: proxify("https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcT_DhhHAloXWTAcX84ZiwdwYHjlM13s9Jsl5SlBh3qc-jzyUUM6", "Casa Loma"),
                rating: 4.5,
                reviews: 31533,
                description: "Grand 1914 castle featuring regular tours & gardens that are open seasonally."
              },
              {
                name: "St. Lawrence Market",
                link: "https://www.google.com/search?q=St.+Lawrence+Market",
                thumbnail: proxify("https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSNzfS0Yisnz-lksUXqnJyMsg_Oqz0b1LqBRxC_0LQ1hfXII1C6", "St. Lawrence Market"),
                rating: 4.6,
                reviews: 39009,
                description: "Spacious market with 100+ vendors, bakers, butchers & artisans, with produce & antiques on weekends."
              },
              {
                name: "Toronto Islands",
                link: "https://www.google.com/search?q=Toronto+Islands",
                thumbnail: proxify("https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcT5in4EAwdgmFl5BBC-t_R2_Emd0JAJ-ynG1DciT5_xRScBGvmU", "Toronto Islands"),
                rating: 4.7,
                reviews: 1828,
                description: "Islands across from downtown offering recreational activities, beaches & family-friendly attractions."
              },
              {
                name: "Hockey Hall of Fame",
                link: "https://www.google.com/search?q=Hockey+Hall+of+Fame",
                thumbnail: proxify("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQM1-Y71XhtzuTXoaA9QPngRo_Ds6c8ohJef9f6C3PdeyY10b_1", "Hockey Hall of Fame"),
                rating: 4.7,
                reviews: 6735,
                description: "Massive hockey museum with gear, games, and the Stanley Cup on display."
              },
              {
                name: "CF Toronto Eaton Centre",
                link: "https://www.google.com/search?q=CF+Toronto+Eaton+Centre",
                thumbnail: proxify("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDE1qITYSV9U8ypboYS1QEp0nkwrgVHCLr3nZ38X39o6HgPsLI", "CF Toronto Eaton Centre"),
                rating: 4.5,
                reviews: 54664,
                description: "Sprawling shopping mall with a historic glass roof and 250+ stores and boutiques."
              },
              {
                name: "High Park",
                link: "https://www.google.com/search?q=High+Park",
                thumbnail: proxify("https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQp4kuV2jzlxXpYaKLz52C-WXb3Rn-1HjGssXnCrd8xKK3YiyYq", "High Park"),
                rating: 4.7,
                reviews: 27472,
                description: "Expansive park featuring trails, gardens, sports areas, a zoo, and more."
              },
              {
                name: "Nathan Phillips Square",
                link: "https://www.google.com/search?q=Nathan+Phillips+Square",
                thumbnail: proxify("https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRthVVW_oiEDVRgiMPp6fNOFu2EosC7h_nQCkNi-0R5MaFy7_HK", "Nathan Phillips Square"),
                rating: 4.6,
                reviews: 39192,
                description: "Lively civic square with skating rink, concerts, and seasonal events in front of city hall."
              },
              {
                name: "Rogers Centre",
                link: "https://www.google.com/search?q=rogers+centre",
                thumbnail: proxify("https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTbvlNUduS39Z2g6TkzqhL235pD6Zc1bGYAvkRsi7Bs7q9Sdcix", "Rogers Centre"),
                rating: 4.1,
                reviews: 10,
                description: "Iconic sports stadium and concert venue, home to the Toronto Blue Jays."
              },
              {
                name: "Evergreen Brick Works",
                link: "https://www.google.com/search?q=Evergreen+Brick+Works",
                thumbnail: proxify("https://lh3.googleusercontent.com/gps-cs-s/AC9h4nor1qie4iFue-79QngzpnpqFQ0LSCHZODMKmJY0Om-hxTc7uksmJ6yK5DUhf2QYYPTywunRd3vD5XR4bqRPoC8ugDGbL1TNOqoiGw5JLAMfAHOsgojrT95P6yLz-JrAUr_mi0RLJA=w180-h120-k-no", "Evergreen Brick Works"),
                rating: 4.6,
                reviews: 9764,
                description: "Eco-friendly attraction with markets, trails, and cultural events in a former industrial space."
              },
              {
                name: "EdgeWalk at the CN Tower",
                link: "https://www.google.com/search?q=EdgeWalk+at+the+CN+Tower",
                thumbnail: proxify("https://lh3.googleusercontent.com/gps-cs-s/AC9h4np4G1N9h-UwdvK6T8kdGAi-ztiyCA2kjues-JBUhppqLTBKM6AyvThbsXudM6Xq2evgPd9cobNjdINhRSg-H-p_bcN-6kfZguvHntKq8FH7ZSqBN23FgQhju2Qqi3QtSD1vMIcp=w160-h120-k-no", "EdgeWalk at the CN Tower"),
                rating: 4.8,
                reviews: 744,
                description: "Outdoor skywalk experience at the top of the CN Tower for thrill-seekers."
              },
              {
                name: "Sankofa Square",
                link: "https://www.google.com/search?q=Sankofa+Square",
                thumbnail: proxify("https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQMmZ6Ii1YyVijipK7Gfnv4SWhlDtTYwKFgeiSng78ZclY6ggz9", "Sankofa Square"),
                rating: 4.5,
                reviews: 20990,
                description: "Downtown public space hosting community events, concerts, and cultural activations."
              }
            ].map((poi, i) => (
              <div key={poi.name} className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 flex gap-4">
                <div className="w-28 h-28 relative rounded-lg overflow-hidden flex-shrink-0">
                  <OptimizedImage
                    src={poi.thumbnail}
                    alt={poi.name}
                    fill
                    className="object-cover"
                    wrapperClassName="w-28 h-28 relative rounded-lg overflow-hidden"
                  />
                </div>
                <div className="flex-1">
                  <a href={`/search?near=${poi.name.toLowerCase().replace(/\s+/g, '-')}`} className="block">
                    <h3 className="text-lg font-semibold text-blue-600 hover:underline">{poi.name}</h3>
                  </a>
                  <p className="text-sm text-gray-500 mb-1">
                    ⭐ {poi.rating} ({poi.reviews.toLocaleString()} reviews)
                  </p>
                  <p className="text-sm text-gray-700">{poi.description}</p>
                  <a 
                    href={`/search?near=${poi.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Find hotels near {poi.name} →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Menu */}
      <MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />
    </div>
  );
}
