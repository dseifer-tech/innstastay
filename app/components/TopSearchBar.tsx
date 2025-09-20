'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { Search } from 'lucide-react';
import RangeDatePicker from '@/app/components/ui/RangeDatePicker';
import { Button } from '@/app/components/ui/Button';
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

  // Initialize from URL params
  useEffect(() => {
    const checkIn = urlSearchParams.get('checkin') || urlSearchParams.get('check_in');
    const checkOut = urlSearchParams.get('checkout') || urlSearchParams.get('check_out');

    if (checkIn || checkOut) {
      try {
        const from = checkIn ? parseISO(checkIn) : undefined;
        const to = checkOut ? parseISO(checkOut) : undefined;
        setDateRange({ from, to });
      } catch (e) {
        log.ui.warn('Invalid date params:', checkIn, checkOut);
      }
    }
  }, [urlSearchParams]);


  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (dateRange?.from) {
      params.set('checkin', format(dateRange.from, 'yyyy-MM-dd'));
    }
    if (dateRange?.to) {
      params.set('checkout', format(dateRange.to, 'yyyy-MM-dd'));
    }
    // Fixed values like homepage
    params.set('adults', '2');
    params.set('children', '0');
    params.set('rooms', '1');

    const queryString = params.toString();
    const newUrl = queryString ? `/search?${queryString}` : '/search';
    router.push(newUrl);
  };

  return (
    <div className={`sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center gap-4">
          {/* Enhanced Date Picker - Same as homepage */}
          <div className="min-w-0 flex-1">
            <RangeDatePicker
              value={dateRange}
              onChange={setDateRange}
              minDate={new Date()}
              label="Check-in date — Check-out date"
            />
          </div>

          {/* Search Button - Enhanced to match */}
          <Button type="button" onClick={handleSearch} size="lg" variant="primary" className="gap-2">
            <Search className="w-5 h-5" />
            <span className="hidden sm:inline">Search Hotels</span>
            <span className="sm:hidden">Search</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
