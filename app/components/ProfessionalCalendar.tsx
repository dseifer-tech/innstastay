'use client';

import { useState, useRef, useEffect } from 'react';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWithinInterval, isBefore, isAfter, addMonths, subMonths, startOfWeek, endOfWeek, isSameMonth } from 'date-fns';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ProfessionalCalendarProps {
  isOpen: boolean;
  onClose: () => void;
  startDate: Date | null;
  endDate: Date | null;
  onDateRangeChange: (start: Date | null, end: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
}

export default function ProfessionalCalendar({
  isOpen,
  onClose,
  startDate,
  endDate,
  onDateRangeChange,
  minDate = new Date(),
  maxDate = addMonths(new Date(), 12)
}: ProfessionalCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(startDate || new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  // Handle date selection
  const handleDateClick = (date: Date) => {
    if (isBefore(date, minDate) || isAfter(date, maxDate)) {
      return;
    }

    if (!startDate || (startDate && endDate)) {
      // Start new selection
      onDateRangeChange(date, null);
    } else {
      // Complete selection
      if (isBefore(date, startDate)) {
        onDateRangeChange(date, startDate);
      } else {
        onDateRangeChange(startDate, date);
      }
    }
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    const days = eachDayOfInterval({ start, end });

    return days;
  };

  // Get day styling classes
  const getDayClasses = (date: Date) => {
    const baseClasses = "w-10 h-10 flex items-center justify-center text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer select-none";
    
    // Disabled dates
    if (isBefore(date, minDate) || isAfter(date, maxDate)) {
      return `${baseClasses} text-gray-300 cursor-not-allowed`;
    }

    // Outside current month
    if (!isSameMonth(date, currentMonth)) {
      return `${baseClasses} text-gray-400`;
    }

    // Selected dates
    if (startDate && isSameDay(date, startDate)) {
      return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700`;
    }

    if (endDate && isSameDay(date, endDate)) {
      return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700`;
    }

    // In range
    if (startDate && endDate && isWithinInterval(date, { start: startDate, end: endDate })) {
      return `${baseClasses} bg-blue-100 text-blue-900 hover:bg-blue-200`;
    }

    // Hover state for potential range
    if (startDate && !endDate && hoveredDate && isWithinInterval(date, { start: startDate, end: hoveredDate })) {
      return `${baseClasses} bg-blue-50 text-blue-900 hover:bg-blue-100`;
    }

    // Today
    if (isSameDay(date, new Date())) {
      return `${baseClasses} text-blue-600 font-semibold hover:bg-blue-50 border-2 border-blue-600`;
    }

    // Default
    return `${baseClasses} text-gray-900 hover:bg-gray-100`;
  };

  // Get number of nights
  const getNightsCount = () => {
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  // Format date for display
  const formatDateDisplay = (date: Date) => {
    return format(date, 'MMM dd');
  };

  if (!isOpen) return null;

  const days = generateCalendarDays();
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Select Dates</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Date Range Display */}
        {(startDate || endDate) && (
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Check-in</p>
                  <p className="font-semibold text-gray-900">
                    {startDate ? formatDateDisplay(startDate) : 'Select date'}
                  </p>
                </div>
                <div className="w-8 h-px bg-gray-300"></div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Check-out</p>
                  <p className="font-semibold text-gray-900">
                    {endDate ? formatDateDisplay(endDate) : 'Select date'}
                  </p>
                </div>
              </div>
              {getNightsCount() > 0 && (
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Nights</p>
                  <p className="font-semibold text-blue-600">{getNightsCount()}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Calendar */}
        <div className="p-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={goToPreviousMonth}
              disabled={isBefore(subMonths(currentMonth, 1), startOfMonth(minDate))}
              className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 hover:border-blue-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h4 className="text-lg font-semibold text-gray-900">
              {format(currentMonth, 'MMMM yyyy')}
            </h4>
            <button
              onClick={goToNextMonth}
              disabled={isAfter(addMonths(currentMonth, 1), endOfMonth(maxDate))}
              className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 hover:border-blue-300"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="w-10 h-10 flex items-center justify-center text-xs font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => (
              <button
                key={date.toISOString()}
                onClick={() => handleDateClick(date)}
                onMouseEnter={() => setHoveredDate(date)}
                onMouseLeave={() => setHoveredDate(null)}
                className={getDayClasses(date)}
                disabled={isBefore(date, minDate) || isAfter(date, maxDate)}
              >
                {format(date, 'd')}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {startDate && endDate 
                ? `${getNightsCount()} night${getNightsCount() !== 1 ? 's' : ''} selected`
                : 'Select your travel dates'
              }
            </p>
            {startDate && endDate && (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Confirm Dates
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
