"use client";

import { useState, useEffect } from 'react';
// import { useSearchParams } from 'next/navigation';
import { format, addDays } from 'date-fns';
// Icons can be added back if rendered in UI
import SearchBarWide from './SearchBarWide';
import RangeDatePicker from '@/app/components/ui/RangeDatePicker';
import { Button } from '@/app/components/ui/Button';
import { type DateRange } from 'react-day-picker';
// import LoadingSpinner from './LoadingSpinner';
import { log } from "@/lib/core/log";

interface StickySearchBarProps {
  className?: string;
}

export default function StickySearchBar({ className = "" }: StickySearchBarProps) {
  // const urlSearchParams = useSearchParams();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTravelerModal, setShowTravelerModal] = useState(false);
  
  // Initialize with URL parameters or defaults
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    addDays(new Date(), 1),
    addDays(new Date(), 2)
  ]);
  const [range, setRange] = useState<DateRange | undefined>({
    from: dateRange[0] ?? undefined,
    to: dateRange[1] ?? undefined,
  });
  const [searchParams, setSearchParams] = useState({
    adults: 2,
    children: 0
  });

  // Update state when URL parameters change
  useEffect(() => {
    const parseDatesFromUrl = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const checkin = urlParams.get('checkin');
        const checkout = urlParams.get('checkout');
        
        if (checkin && checkout) {
          // Parse ISO date strings (YYYY-MM-DD) directly to avoid timezone issues
          const parseISODate = (isoString: string): Date | null => {
            const [year, month, day] = isoString.split('-').map(Number);
            
            // Validate the parsed values
            if (!year || !month || !day || isNaN(year) || isNaN(month) || isNaN(day)) {
              log.ui.warn('Invalid date format:', isoString);
              return null;
            }
            
            // Create date in local timezone to avoid timezone shifts
            return new Date(year, month - 1, day);
          };
          
          const startDate = parseISODate(checkin);
          const endDate = parseISODate(checkout);
          
          if (startDate && endDate) {
            setDateRange([startDate, endDate]);
          }
        }
      } catch (error) {
        // Silently handle date parsing errors
      }
    };

    parseDatesFromUrl();
  }, []);


  const handleSearch = () => {
    const checkIn = dateRange[0] ? format(dateRange[0], 'yyyy-MM-dd') : format(addDays(new Date(), 1), 'yyyy-MM-dd');
    const checkOut = dateRange[1] ? format(dateRange[1], 'yyyy-MM-dd') : format(addDays(new Date(), 2), 'yyyy-MM-dd');
    
    const searchUrl = `/search?checkin=${checkIn}&checkout=${checkOut}&adults=${searchParams.adults}&children=${searchParams.children}`;
    window.location.href = searchUrl;
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

  return (
    <div className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-100 shadow-sm ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-center">
          <div className="w-full max-w-4xl">
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
        </div>
      </div>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowDatePicker(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setShowDatePicker(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="date-picker-title"
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 id="date-picker-title" className="text-lg font-semibold">Select Dates</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDatePicker(false)}
                aria-label="Close date picker"
                className="p-1"
              >
                <span className="text-2xl">×</span>
              </Button>
            </div>
            
            <RangeDatePicker
              value={range}
              onChange={(r) => {
                setRange(r);
                setDateRange([r?.from ?? null, r?.to ?? null]);
              }}
              minDate={new Date()}
              label="Select dates"
            />

            <div className="mt-4 flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setRange(undefined);
                  setDateRange([null, null]);
                }}
              >
                Clear dates
              </Button>
              <Button variant="primary" size="sm" onClick={() => setShowDatePicker(false)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Traveler Modal */}
      {showTravelerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select Travelers</h3>
              <button
                onClick={() => setShowTravelerModal(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close traveler selection"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-800">Adults</p>
                  <p className="text-xs text-neutral-500">Ages 13+</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleTravelerChange('adults', Math.max(1, searchParams.adults - 1))}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    aria-label="Decrease adults"
                  >
                    <span className="text-gray-600">−</span>
                  </button>
                  <span className="w-8 text-center font-medium">{searchParams.adults}</span>
                  <button
                    type="button"
                    onClick={() => handleTravelerChange('adults', Math.min(6, searchParams.adults + 1))}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    aria-label="Increase adults"
                  >
                    <span className="text-gray-600">+</span>
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-800">Children</p>
                  <p className="text-xs text-neutral-500">Ages 0-12</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleTravelerChange('children', Math.max(0, searchParams.children - 1))}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    aria-label="Decrease children"
                  >
                    <span className="text-gray-600">−</span>
                  </button>
                  <span className="w-8 text-center font-medium">{searchParams.children}</span>
                  <button
                    type="button"
                    onClick={() => handleTravelerChange('children', Math.min(4, searchParams.children + 1))}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    aria-label="Increase children"
                  >
                    <span className="text-gray-600">+</span>
                  </button>
                </div>
              </div>
              
              <Button variant="primary" size="md" fullWidth onClick={() => setShowTravelerModal(false)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
