'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { format } from 'date-fns';
import { DayPicker, DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import '@/app/styles/date-picker.css';
import clsx from 'clsx';
import { Calendar as CalendarIcon } from 'lucide-react';

type Props = {
  value?: DateRange | undefined;
  onChange?: (range: DateRange | undefined) => void;
  minDate?: Date;
  label?: string;
};

function toYMD(d?: Date | null) {
  return d ? format(d, 'yyyy-MM-dd') : '';
}

export default function RangeDatePicker({
  value,
  onChange,
  minDate,
  label = 'Check-in date — Check-out date',
}: Props) {
  const [range, setRange] = useState<DateRange | undefined>(
    value ?? { from: undefined, to: undefined }
  );
  const [months, setMonths] = useState(2);
  const [tempRange, setTempRange] = useState<DateRange | undefined>();
  const [popupPosition, setPopupPosition] = useState<'bottom' | 'top'>('bottom');
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Position calculation for popup
  const calculatePosition = () => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    
    // Estimate calendar height (roughly 400px for 2 months)
    const estimatedCalendarHeight = months === 1 ? 350 : 450;
    
    // Use top positioning if there's not enough space below
    if (spaceBelow < estimatedCalendarHeight && spaceAbove > estimatedCalendarHeight) {
      setPopupPosition('top');
    } else {
      setPopupPosition('bottom');
    }
  };

  useEffect(() => {
    // Responsive months and position recalculation
    const update = () => {
      setMonths(window.innerWidth < 640 ? 1 : 2);
      setTimeout(() => calculatePosition(), 0); // Recalculate position after state update
    };
    
    const handleScroll = () => {
      calculatePosition();
    };
    
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [months]);


  useEffect(() => {
    onChange?.(range);
  }, [range, onChange]);

  const labelText = useMemo(() => {
    const from = toYMD(range?.from ?? undefined);
    const to = toYMD(range?.to ?? undefined);
    if (!from && !to) return label;
    if (from && !to) return `${from} — …`;
    return `${from} — ${to}`;
  }, [range?.from, range?.to, label]);

  const disabledDays = [{ before: minDate ?? new Date() }];

  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <Popover.Button
            ref={buttonRef}
            className={clsx(
              'font-date font-normal sm:font-medium',
              'relative w-full rounded-2xl border-2 border-blue-200/60 px-6 py-5 text-left',
              'bg-gradient-to-r from-white to-blue-50/30 hover:from-blue-50/40 hover:to-blue-100/40',
              'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30',
              'shadow-lg hover:shadow-xl transition-all duration-200',
              'text-lg font-medium tracking-normal'
            )}
            aria-label="Choose check-in and check-out dates"
            onClick={() => {
              // Start fresh selection when opening
              setTempRange({ from: undefined, to: undefined });
              calculatePosition();
              console.log('Opening date picker');
            }}
          >
            <CalendarIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-blue-600" />
            <span className="pl-10 text-gray-900 font-medium tracking-normal">{labelText}</span>
          </Popover.Button>

          <Transition
            enter="transition ease-out duration-150"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel 
              className={clsx(
                'absolute z-50',
                // Mobile: full width with padding
                'left-0 right-0 mx-2 sm:mx-0',
                // Desktop: position relative to button
                'sm:left-0 sm:right-auto sm:w-auto sm:min-w-full',
                // Vertical positioning
                popupPosition === 'bottom' ? 'mt-3' : 'bottom-full mb-3'
              )}
            >
              <div className="rounded-3xl border-2 border-blue-100 bg-white p-4 sm:p-6 shadow-2xl ring-1 ring-black/5 max-h-[80vh] overflow-auto">
                <DayPicker
                  mode="range"
                  selected={tempRange}
                  onSelect={(newRange) => {
                    console.log('Date picker selection:', newRange);
                    
                    if (!newRange?.from) {
                      // Clear selection
                      setTempRange({ from: undefined, to: undefined });
                      return;
                    }

                    // Handle same date selection (prevent same check-in/check-out)
                    if (newRange?.from && newRange?.to && 
                        newRange.from.getTime() === newRange.to.getTime()) {
                      setTempRange({ from: newRange.from, to: undefined });
                      return;
                    }

                    // Update temp range for visual feedback
                    setTempRange(newRange);
                    
                    // Only commit to final range when we have both dates
                    if (newRange?.from && newRange?.to && 
                        newRange.from.getTime() !== newRange.to.getTime()) {
                      setRange(newRange);
                      setTimeout(() => close(), 300);
                    }
                  }}
                  numberOfMonths={months}
                  disabled={disabledDays}
                  defaultMonth={range?.from ?? new Date()}
                  styles={{
                    day_selected: { 
                      backgroundColor: '#2563eb', 
                      color: 'white', 
                      fontWeight: 900,
                      fontSize: '1.1rem',
                      borderRadius: '12px'
                    },
                    day_today: { 
                      fontWeight: 800, 
                      color: '#2563eb',
                      fontSize: '1.05rem',
                      textDecoration: 'underline'
                    },
                    caption: { 
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      fontFamily: 'ui-monospace, SFMono-Regular, monospace'
                    },
                    head_cell: {
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      fontFamily: 'ui-monospace, SFMono-Regular, monospace'
                    },
                    cell: {
                      fontSize: '1rem',
                      fontWeight: 600,
                      fontFamily: 'ui-monospace, SFMono-Regular, monospace'
                    }
                  }}
                />
                <div className="flex items-center justify-between px-3 pb-3 pt-4 border-t-2 border-blue-100">
                  <button
                    type="button"
                    className="text-base font-bold text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-xl transition-all duration-200 font-mono"
                    onClick={() => {
                      setTempRange({ from: undefined, to: undefined });
                      setRange({ from: undefined, to: undefined });
                      console.log('Date range cleared');
                    }}
                  >
                    Clear dates
                  </button>
                  <button
                    type="button"
                    className="text-base font-bold text-blue-700 hover:text-blue-900 hover:bg-blue-100 px-4 py-2 rounded-xl transition-all duration-200 font-mono"
                    onClick={() => close()}
                  >
                    Done
                  </button>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
