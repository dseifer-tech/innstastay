'use client';

import { useState, useEffect } from 'react';
import HeroSearch from './components/HeroSearch';
import HotelCard from './components/hotel/HotelCard';
import FAQ from './components/FAQ';
import DirectBenefits from './components/DirectBenefits';
import DirectBookingPromise from './components/DirectBookingPromise';
import AboutContent from './components/AboutContent';
import TrustSignals from './components/TrustSignals';
import type { Hotel } from '@/types/hotel';
import { log } from '@/lib/core/log';
import { Pause, Play, ChevronLeft, ChevronRight } from 'lucide-react';

interface HomePageClientProps {
  initialHotels?: Hotel[];
}

export default function HomePageClient({ initialHotels = [] }: HomePageClientProps) {
  const [hotels, setHotels] = useState<Hotel[]>(initialHotels);
  const [hotelsLoading, setHotelsLoading] = useState(initialHotels.length === 0);
  const [carouselPaused, setCarouselPaused] = useState(false);
  const [currentScrollPosition, setCurrentScrollPosition] = useState(0);


  // Fetch hotels only if not pre-loaded from server
  useEffect(() => {
    if (initialHotels.length > 0) {
      // Hotels were pre-loaded on server, no need to fetch
      return;
    }

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
  }, [initialHotels.length]);

  return (
    <>
      <HeroSearch 
        title="Skip the Middlemen. Book Direct."
        subtitle="Compare official prices and policies—no platform fees, no call centers."
        theme="dark"
      />

      {/* Everything below can live in the gradient wrapper */}
      <div className="min-h-screen bg-gradient-to-b from-[#eef5ff] to-white">

        {/* WHY DIRECT: Updated benefits section with new copy and design */}
        <div className="h-4 sm:h-6" />
        <DirectBenefits />

        {/* DIRECT BOOKING PROMISE: Safer messaging without price matching */}
        <DirectBookingPromise />

        {/* HOTEL DIRECTORY: Featured downtown properties */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-neutral-800 mb-4">Featured Downtown Hotels</h2>
              <p className="text-lg text-neutral-600">Direct rates from Toronto&apos;s top properties</p>
            </div>

            {/* Carousel Controls */}
            {!hotelsLoading && hotels.length > 0 && (
              <div className="flex justify-center gap-4 mb-6">
                <button
                  onClick={() => setCarouselPaused(!carouselPaused)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-200 text-sm font-medium text-gray-700"
                  aria-label={carouselPaused ? 'Resume carousel' : 'Pause carousel'}
                >
                  {carouselPaused ? (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Resume</span>
                    </>
                  ) : (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>Pause</span>
                    </>
                  )}
                </button>
                <span className="px-4 py-2 text-sm text-gray-500 bg-gray-50 rounded-full">
                  Scroll to see all hotels →
                </span>
              </div>
            )}

            {/* Horizontal scrolling carousel */}
            <div className="relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-50 via-blue-50 to-transparent z-10 pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-50 via-blue-50 to-transparent z-10 pointer-events-none"></div>
              
              <div 
                className={`flex gap-4 transition-transform duration-300 ${!carouselPaused ? 'animate-scroll' : ''}`}
                style={{
                  animationPlayState: carouselPaused ? 'paused' : 'running'
                }}
              >
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

        {/* ABOUT SECTION: About content with SEO-friendly H2 */}
        <AboutContent />

        {/* TRUST SIGNALS: Qualitative benefits */}
        <TrustSignals />

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
                href="/#about" 
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