'use client';

import { useEffect, useMemo, useState } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { format } from 'date-fns';
import { DayPicker, DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import clsx from 'clsx';

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
  const [isSelecting, setIsSelecting] = useState(false); // Track if we're in selection mode

  useEffect(() => {
    // Responsive months (1 on small screens)
    const update = () => setMonths(window.innerWidth < 640 ? 1 : 2);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);


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
      {({ close }) => (
        <>
          <Popover.Button
            className={clsx(
              'w-full rounded-xl border border-black/10 px-4 py-3 text-left text-sm',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600',
              'bg-white hover:bg-gray-50'
            )}
            aria-label="Choose check-in and check-out dates"
            onClick={() => {
              // Reset selection state when opening
              setIsSelecting(true);
              console.log('Opening date picker - ready for fresh selection');
            }}
          >
            {labelText}
          </Popover.Button>

          <Transition
            enter="transition ease-out duration-150"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute z-40 mt-2">
              <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-xl">
                <DayPicker
                  mode="range"
                  selected={isSelecting ? undefined : range} // Clear visual selection when starting fresh
                  onSelect={(newRange) => {
                    console.log('Date picker selection:', newRange, 'isSelecting:', isSelecting);
                    
                    if (!newRange?.from) {
                      // Clear selection
                      setRange({ from: undefined, to: undefined });
                      setIsSelecting(false);
                      return;
                    }

                    // If we're starting a fresh selection or only have a from date
                    if (isSelecting || !newRange?.to) {
                      // First click or incomplete range - just set what we have
                      if (newRange?.from && newRange?.to && 
                          newRange.from.getTime() === newRange.to.getTime()) {
                        // Same date clicked - only set from
                        setRange({ from: newRange.from, to: undefined });
                      } else {
                        setRange(newRange);
                      }
                      
                      // If we have both dates, we're done selecting
                      if (newRange?.from && newRange?.to && 
                          newRange.from.getTime() !== newRange.to.getTime()) {
                        setIsSelecting(false);
                        setTimeout(() => close(), 300);
                      }
                    } else {
                      // We have a complete range, set it
                      setRange(newRange);
                      setIsSelecting(false);
                      if (newRange?.from && newRange?.to) {
                        setTimeout(() => close(), 300);
                      }
                    }
                  }}
                  numberOfMonths={months}
                  disabled={disabledDays}
                  defaultMonth={range?.from ?? new Date()}
                />
                <div className="flex items-center justify-between px-2 pb-2 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    className="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-1 rounded-lg transition-colors"
                    onClick={() => {
                      setRange({ from: undefined, to: undefined });
                      setIsSelecting(true); // Ready for fresh selection
                      console.log('Date range cleared - ready for fresh selection');
                    }}
                  >
                    Clear dates
                  </button>
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors"
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
