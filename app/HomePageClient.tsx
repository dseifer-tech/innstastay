'use client';

import { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import { Menu, X, CheckCircle, Heart, Zap, Shield, DollarSign } from 'lucide-react';
import SearchBarWide from './components/SearchBarWide';
import LoadingSpinner from './components/LoadingSpinner';
import OptimizedImage from './components/OptimizedImage';
import MobileMenu from './components/MobileMenu';
import HotelCard from './components/hotel/HotelCard';
import ProfessionalCalendar from './components/ProfessionalCalendar';
import SecondaryCTA from './components/SecondaryCTA';
import FAQ from './components/FAQ';
import StickyMobileCTA from './components/StickyMobileCTA';
import type { Hotel } from '@/types/hotel';
import { log } from '@/lib/core/log';

interface SearchParams {
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
}

export default function HomePageClient() {
  const [isSearching, setIsSearching] = useState(false);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [hotelsLoading, setHotelsLoading] = useState(true);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    checkIn: format(new Date(), 'yyyy-MM-dd'),
    checkOut: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    adults: 2,
    children: 0
  });
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    new Date(),
    addDays(new Date(), 1)
  ]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTravelerModal, setShowTravelerModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Fetch hotels for homepage preview
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setHotelsLoading(true);
        
        // Use proper API endpoint
        const response = await fetch('/api/hotels');
        const data = await response.json();
        
        if (data.success && data.hotels) {
          setHotels(data.hotels.slice(0, 8)); // Show first 8 hotels
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

  // Handle date range changes
  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setDateRange([start, end]);
  };

  const handleSearch = async () => {
    setIsSearching(true);
    
    const checkIn = dateRange[0] ? format(dateRange[0], 'yyyy-MM-dd') : searchParams.checkIn;
    const checkOut = dateRange[1] ? format(dateRange[1], 'yyyy-MM-dd') : searchParams.checkOut;
    
    const searchUrl = `/search?checkin=${checkIn}&checkout=${checkOut}&adults=${searchParams.adults}&children=${searchParams.children}`;
    
    // Show loading spinner for a brief moment before redirecting
    setTimeout(() => {
      window.location.href = searchUrl;
    }, 500);
  };

  const handleTravelerChange = (type: 'adults' | 'children', value: number) => {
    setSearchParams({
      ...searchParams,
      [type]: value
    });
  };

  const getTravelerText = () => {
    const total = searchParams.adults + searchParams.children;
    return `${total} traveler${total > 1 ? 's' : ''}, 1 room`;
  };

  // Show loading spinner when searching
  if (isSearching) {
    return <LoadingSpinner message="Preparing your search..." variant="search" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eef5ff] to-white">
      {/* HERO START */}
      <section id="hero" className="hero">
        <picture className="hero-media">
          <OptimizedImage
            src="/hero/homepage.jpg"
            alt="Toronto skyline with CN Tower at golden hour"
            className="hero-img"
            width={1920} 
            height={800}
            priority={true}
            sizes="100vw"
          />
        </picture>

        {/* Gradient overlays */}
        <div className="hero-overlay hero-overlay-dark"></div>
        <div className="hero-overlay hero-overlay-fade"></div>

        {/* Content */}
        <div className="hero-content" role="region" aria-label="Find direct hotel rates in downtown Toronto">
          <h1 className="hero-title">Downtown Toronto Hotels — Book Direct</h1>
          <p className="hero-sub">Live rates from verified downtown hotels. No middlemen, no extra fees.</p>

          <div
            id="search-widget"
            className="mx-auto w-[min(980px,96vw)] p-0 bg-transparent border-0 shadow-none"
          >
            <SearchBarWide 
              dateLabel="Dates"
              dateValue={dateRange[0] && dateRange[1] 
                ? `${format(dateRange[0], 'MMM dd')} – ${format(dateRange[1], 'MMM dd')}`
                : 'Select dates'
              }
              onOpenDates={() => setShowDatePicker(!showDatePicker)}
              paxLabel="Travelers"
              paxValue={getTravelerText()}
              onOpenPax={() => setShowTravelerModal(!showTravelerModal)}
              onSearch={handleSearch}
            />
          </div>

          <ul className="trust" aria-label="Reasons to book direct in downtown Toronto">
            <li>📍 Downtown Toronto</li>
            <li>⚡ Live Direct Rates</li>
            <li>🟢 No Platform Fees</li>
          </ul>
        </div>
      </section>
      {/* HERO END */}

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-800 mb-6">
              Why Book Direct?
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Skip the middlemen and get the best rates directly from downtown Toronto hotels.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 text-center group hover:shadow-lg transition-shadow duration-200">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-3">Transparent Pricing</h3>
                              <p className="text-neutral-600 text-sm leading-relaxed">The hotel&apos;s actual rate with no markups or hidden fees</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center group hover:shadow-lg transition-shadow duration-200">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-3">Flexible Cancellation</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">Loyalty perks and cancellation policies directly from the hotel</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 text-center group hover:shadow-lg transition-shadow duration-200">
              <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-3">Loyalty Perks</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">Earn points and benefits when available through direct booking</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 text-center group hover:shadow-lg transition-shadow duration-200">
              <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-3">0% Commission</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">No booking fees or commissions — ever</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hotel Directory Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-3 flex items-end justify-between">
            <h2 className="text-xl font-semibold">Downtown picks</h2>
            <a href="/search" className="text-sm font-medium underline">See all</a>
          </div>

          {/* Horizontal auto-scrolling carousel */}
          <div className="relative overflow-hidden group">
            {/* Left gradient overlay */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-50 via-blue-50 to-transparent z-10 pointer-events-none"></div>
            
            {/* Right gradient overlay */}
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-50 via-blue-50 to-transparent z-10 pointer-events-none"></div>
            
            <div className="flex gap-4 animate-scroll group-hover:pause">
              {hotelsLoading ? (
                <div className="flex gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={`skeleton-${i}`} className="w-64 sm:w-72 lg:w-80 shrink-0 bg-white rounded-2xl shadow-sm animate-pulse">
                      <div className="aspect-[4/3] bg-gray-200 rounded-t-2xl"></div>
                      <div className="p-3 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : hotels.length === 0 ? (
                <p className="text-center text-neutral-600">No featured hotels available at the moment.</p>
              ) : (
                <>
                  {/* First set of hotels */}
                  <div className="flex gap-4">
                    {hotels.map((hotel) => (
                      <div key={hotel.id} className="w-64 sm:w-72 lg:w-80 shrink-0">
                        <HotelCard hotel={hotel} variant="home" />
                      </div>
                    ))}
                  </div>
                  {/* Duplicate set for seamless loop */}
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

      {/* Secondary CTA */}
      <SecondaryCTA />

      {/* Trust Badges */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-3">Verified by InnstaStay</h3>
              <p className="text-neutral-600 text-sm">All hotels are verified and trusted partners</p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-3">Official Rate</h3>
              <p className="text-neutral-600 text-sm">No markups or hidden fees</p>
            </div>
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <X className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-3">No Commissions</h3>
              <p className="text-neutral-600 text-sm">Direct booking with hotels</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* Optional CTA Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
            Downtown stays, zero commission.
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            Skip the middlemen and find your hotel in downtown Toronto with real-time prices from the source.
          </p>
          <a 
            href="/search" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm font-semibold shadow hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Find a Hotel in Downtown Toronto →
          </a>
        </div>
      </section>

      {/* Professional Calendar Modal */}
      <ProfessionalCalendar
        isOpen={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        startDate={dateRange[0]}
        endDate={dateRange[1]}
        onDateRangeChange={handleDateRangeChange}
        minDate={new Date()}
        maxDate={addDays(new Date(), 365)}
      />

      {/* Traveler Modal */}
      {showTravelerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Select Travelers</h3>
              <button
                onClick={() => setShowTravelerModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adults</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleTravelerChange('adults', Math.max(1, searchParams.adults - 1))}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold w-8 text-center">{searchParams.adults}</span>
                  <button
                    onClick={() => handleTravelerChange('adults', searchParams.adults + 1)}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Children</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleTravelerChange('children', Math.max(0, searchParams.children - 1))}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold w-8 text-center">{searchParams.children}</span>
                  <button
                    onClick={() => handleTravelerChange('children', searchParams.children + 1)}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowTravelerModal(false)}
                className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Mobile CTA */}
      <StickyMobileCTA onClick={handleSearch} />

      {/* Mobile Menu */}
      <MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />
    </div>
  );
}
