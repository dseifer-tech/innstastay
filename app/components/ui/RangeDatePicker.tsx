'use client';

import { useEffect, useMemo, useState } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { format, addDays, isAfter } from 'date-fns';
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

  useEffect(() => {
    // Responsive months (1 on small screens)
    const update = () => setMonths(window.innerWidth < 640 ? 1 : 2);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Close calendar automatically when a full range is chosen
  const isComplete = !!range?.from && !!range?.to;

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
          >
            <span className="block">{labelText}</span>
            <span className="text-xs text-gray-500 block mt-1">
              DEBUG: from={range?.from?.toDateString() || 'none'}, to={range?.to?.toDateString() || 'none'}
            </span>
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
                  selected={range}
                  onSelect={(newRange) => {
                    console.log('Date picker selection:', newRange);
                    
                    // Only set range if we have at least a from date
                    if (newRange?.from) {
                      // If user selected same date for from and to, just set from
                      if (newRange?.from && newRange?.to && 
                          newRange.from.getTime() === newRange.to.getTime()) {
                        setRange({ from: newRange.from, to: undefined });
                      } else {
                        setRange(newRange);
                      }
                    } else {
                      // Clear selection
                      setRange({ from: undefined, to: undefined });
                    }
                    
                    // Auto-close only when we have both different dates
                    if (newRange?.from && newRange?.to && 
                        newRange.from.getTime() !== newRange.to.getTime()) {
                      setTimeout(() => close(), 300);
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
                      console.log('Date range cleared');
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
