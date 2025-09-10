'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { Search, User, X } from 'lucide-react';
import RangeDatePicker from '@/app/components/ui/RangeDatePicker';
import { type DateRange } from 'react-day-picker';
import { log } from '@/lib/core/log';

interface TopSearchBarProps {
  className?: string;
}

export default function TopSearchBar({ className = "" }: TopSearchBarProps) {
  const router = useRouter();
  const urlSearchParams = useSearchParams();
  
  // State for form inputs
  const [dateRange, setDateRange] = useState<DateRange | undefined>({ from: undefined, to: undefined });
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  
  // Modal states
  const [showTravelerModal, setShowTravelerModal] = useState(false);

  // Initialize from URL params
  useEffect(() => {
    const checkIn = urlSearchParams.get('checkin') || urlSearchParams.get('check_in');
    const checkOut = urlSearchParams.get('checkout') || urlSearchParams.get('check_out');
    const adultsParam = urlSearchParams.get('adults');
    const childrenParam = urlSearchParams.get('children');
    const roomsParam = urlSearchParams.get('rooms');

    if (checkIn || checkOut) {
      try {
        const from = checkIn ? parseISO(checkIn) : undefined;
        const to = checkOut ? parseISO(checkOut) : undefined;
        setDateRange({ from, to });
      } catch (e) {
        log.ui.warn('Invalid date params:', checkIn, checkOut);
      }
    }

    if (adultsParam) setAdults(Number(adultsParam));
    if (childrenParam) setChildren(Number(childrenParam));
    if (roomsParam) setRooms(Number(roomsParam));
  }, [urlSearchParams]);


  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (dateRange?.from) {
      params.set('checkin', format(dateRange.from, 'yyyy-MM-dd'));
    }
    if (dateRange?.to) {
      params.set('checkout', format(dateRange.to, 'yyyy-MM-dd'));
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
          <div className="min-w-0 flex-1">
            <RangeDatePicker
              value={dateRange}
              onChange={setDateRange}
              minDate={new Date()}
              label="Select dates"
            />
          </div>

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
