'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { format, addDays, parseISO } from 'date-fns';
import { Search, Calendar, User, X } from 'lucide-react';
import ProfessionalCalendar from './ProfessionalCalendar';
import { log } from '@/lib/core/log';

interface TopSearchBarProps {
  className?: string;
}

export default function TopSearchBar({ className = "" }: TopSearchBarProps) {
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  
  // State for form inputs
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  
  // Modal states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTravelerModal, setShowTravelerModal] = useState(false);

  // Initialize from URL params
  useEffect(() => {
    const checkIn = urlSearchParams.get('checkin') || urlSearchParams.get('check_in');
    const checkOut = urlSearchParams.get('checkout') || urlSearchParams.get('check_out');
    const adultsParam = urlSearchParams.get('adults');
    const childrenParam = urlSearchParams.get('children');
    const roomsParam = urlSearchParams.get('rooms');

    if (checkIn) {
      try {
        const checkInDate = parseISO(checkIn);
        setDateRange(prev => [checkInDate, prev[1]]);
      } catch (e) {
        log.ui.warn('Invalid check-in date:', checkIn);
      }
    }

    if (checkOut) {
      try {
        const checkOutDate = parseISO(checkOut);
        setDateRange(prev => [prev[0], checkOutDate]);
      } catch (e) {
        log.ui.warn('Invalid check-out date:', checkOut);
      }
    }

    if (adultsParam) setAdults(Number(adultsParam));
    if (childrenParam) setChildren(Number(childrenParam));
    if (roomsParam) setRooms(Number(roomsParam));
  }, [urlSearchParams]);

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setDateRange([start, end]);
    if (start && end) {
      setShowDatePicker(false);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (dateRange[0]) {
      params.set('checkin', format(dateRange[0], 'yyyy-MM-dd'));
    }
    if (dateRange[1]) {
      params.set('checkout', format(dateRange[1], 'yyyy-MM-dd'));
    }
    if (adults > 0) params.set('adults', adults.toString());
    if (children > 0) params.set('children', children.toString());
    if (rooms > 0) params.set('rooms', rooms.toString());

    const queryString = params.toString();
    const newUrl = queryString ? `/search?${queryString}` : '/search';
    router.push(newUrl);
  };

  const getTravelerText = () => {
    const total = adults + children;
    return `${total} traveler${total > 1 ? 's' : ''}, ${rooms} room${rooms > 1 ? 's' : ''}`;
  };

  return (
    <div className={`sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center gap-3">
          {/* Dates */}
          <button
            type="button"
            onClick={() => setShowDatePicker(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors min-w-0 flex-1"
          >
            <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <div className="min-w-0 text-left">
              <div className="text-xs text-gray-500">Check-in • Check-out</div>
              <div className="text-sm font-medium text-gray-900 truncate">
                {dateRange[0] && dateRange[1] 
                  ? `${format(dateRange[0], 'MMM dd')} – ${format(dateRange[1], 'MMM dd')}`
                  : 'Select dates'
                }
              </div>
            </div>
          </button>

          {/* Travelers */}
          <button
            type="button"
            onClick={() => setShowTravelerModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors min-w-0 flex-1"
          >
            <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <div className="min-w-0 text-left">
              <div className="text-xs text-gray-500">Travelers</div>
              <div className="text-sm font-medium text-gray-900 truncate">
                {getTravelerText()}
              </div>
            </div>
          </button>

          {/* Search Button */}
          <button
            type="button"
            onClick={handleSearch}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>
      </div>

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Travelers</h3>
              <button
                onClick={() => setShowTravelerModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Adults */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Adults</div>
                  <div className="text-sm text-gray-500">Age 18+</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">{adults}</span>
                  <button
                    onClick={() => setAdults(adults + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Children</div>
                  <div className="text-sm text-gray-500">Age 0-17</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">{children}</span>
                  <button
                    onClick={() => setChildren(children + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Rooms */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Rooms</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setRooms(Math.max(1, rooms - 1))}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">{rooms}</span>
                  <button
                    onClick={() => setRooms(rooms + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowTravelerModal(false)}
              className="w-full mt-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
