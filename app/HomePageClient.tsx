'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Heart, Zap, Shield, DollarSign, Star, TrendingUp, Users } from 'lucide-react';
import SearchBlock from './components/SearchBlock';
import Hero from './components/Hero';
import HotelCard from './components/hotel/HotelCard';
import FAQ from './components/FAQ';
import type { Hotel } from '@/types/hotel';
import { log } from '@/lib/core/log';

export default function HomePageClient() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [hotelsLoading, setHotelsLoading] = useState(true);

  // Website schema for SEO
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "InnstaStay",
    "url": "https://www.innstastay.com",
    "description": "Compare verified direct rates at top Toronto hotels. No commissions or markups—book direct and save with InnstaStay.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.innstastay.com/search?checkin={checkin}&checkout={checkout}&adults={adults}&children={children}"
      },
      "query-input": "required name=checkin name=checkout name=adults name=children"
    }
  };

  // Fetch hotels for homepage preview
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setHotelsLoading(true);
        const response = await fetch('/api/hotels');
        const data = await response.json();
        
        if (data.success && data.hotels) {
          setHotels(data.hotels.slice(0, 8));
        } else {
          log.ui.error('Failed to fetch hotels:', data.error);
        }
      } catch (err) {
        log.ui.error('Failed to load hotels:', err);
      } finally {
        setHotelsLoading(false);
      }
    };

    fetchHotels();
  }, []);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema)
        }}
      />
      
      <Hero 
        title="Skip the Middlemen. Book Direct."
        subtitle="Compare live rates from Toronto hotels. Zero commissions, zero markups."
        imageSrc="/hero/homepage.jpg"
        imageAlt="Toronto skyline at sunset"
      />

      {/* Everything below can live in the gradient wrapper */}
      <div className="min-h-screen bg-gradient-to-b from-[#eef5ff] to-white">
        {/* SEARCH BLOCK: Dedicated white card section */}
        <SearchBlock />

        {/* WHY DIRECT: OTA vs Direct comparison grid */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-neutral-800 mb-6">
                Why Skip the OTAs?
              </h2>
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
                Get the real deal: direct hotel rates without the booking site markup.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 text-center group hover:shadow-lg transition-shadow duration-200">
                <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-3">OTAs Mark Up</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">Booking sites add 10-25% commissions to hotel rates</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 text-center group hover:shadow-lg transition-shadow duration-200">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-3">We Show Real Rates</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">The hotel&apos;s actual price with zero markup</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center group hover:shadow-lg transition-shadow duration-200">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-3">Better Cancellation</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">Flexible policies and loyalty perks direct from hotels</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 text-center group hover:shadow-lg transition-shadow duration-200">
                <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-3">Earn Loyalty Points</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">Get rewards when you book directly with hotels</p>
              </div>
            </div>
          </div>
        </section>

        {/* TRANSPARENCY BANNER: Best Price Promise */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Shield className="w-10 h-10 text-white" />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Best Price Promise
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed">
                Find a lower rate elsewhere? We&apos;ll match it and give you $50 credit. 
                That&apos;s how confident we are in our direct rates.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">0%</div>
                  <div className="text-blue-100">Commission</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">$0</div>
                  <div className="text-blue-100">Booking Fees</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">100%</div>
                  <div className="text-blue-100">Transparent</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOTEL DIRECTORY: Featured downtown properties */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-neutral-800 mb-4">Featured Downtown Hotels</h2>
              <p className="text-lg text-neutral-600">Direct rates from Toronto&apos;s top properties</p>
            </div>

            {/* Horizontal scrolling carousel */}
            <div className="relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-50 via-blue-50 to-transparent z-10 pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-50 via-blue-50 to-transparent z-10 pointer-events-none"></div>
              
              <div className="flex gap-4 animate-scroll group-hover:pause">
                {hotelsLoading ? (
                  <div className="flex gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={`skeleton-${i}`} className="w-64 sm:w-72 lg:w-80 shrink-0 bg-white rounded-2xl shadow-sm animate-pulse">
                        <div className="aspect-[4/3] bg-gray-200 rounded-t-2xl"></div>
                        <div className="p-4 space-y-3">
                          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : hotels.length === 0 ? (
                  <p className="text-center text-neutral-600 w-full">No featured hotels available at the moment.</p>
                ) : (
                  <>
                    <div className="flex gap-4">
                      {hotels.map((hotel) => (
                        <div key={hotel.id} className="w-64 sm:w-72 lg:w-80 shrink-0">
                          <HotelCard hotel={hotel} variant="home" />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-4">
                      {hotels.map((hotel) => (
                        <div key={`${hotel.id}-duplicate`} className="w-64 sm:w-72 lg:w-80 shrink-0">
                          <HotelCard hotel={hotel} variant="home" />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="text-center mt-12">
              <a 
                href="/search" 
                className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                View All Hotels →
              </a>
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF: Trust indicators */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-neutral-800 mb-2">10,000+</div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">Happy Travelers</h3>
                <p className="text-neutral-600 text-sm">Saved money by booking direct</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-neutral-800 mb-2">4.9/5</div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">Trust Rating</h3>
                <p className="text-neutral-600 text-sm">From verified bookings</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-neutral-800 mb-2">$2.3M+</div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-2">Saved in Fees</h3>
                <p className="text-neutral-600 text-sm">By skipping booking sites</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <FAQ />

        {/* FINAL CTA */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to save on your Toronto stay?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join thousands who&apos;ve ditched the booking sites and saved money with direct hotel rates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/search" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Find Direct Rates →
              </a>
              <a 
                href="/about" 
                className="inline-block border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl text-lg font-bold transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}