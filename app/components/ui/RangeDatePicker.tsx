'use client';

import { useEffect, useMemo, useState } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { format } from 'date-fns';
import { DayPicker, DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
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
      {({ open, close }) => (
        <>
          <Popover.Button
            className={clsx(
              'relative w-full rounded-xl border border-black/10 px-4 py-3 text-left text-sm',
              'bg-white hover:bg-gray-50',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600',
              'tabular-nums tracking-tight'
            )}
            aria-label="Choose check-in and check-out dates"
            onClick={() => {
              // Start fresh selection when opening
              setTempRange({ from: undefined, to: undefined });
              console.log('Opening date picker');
            }}
          >
            <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <span className="pl-6">{labelText}</span>
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
              <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-2xl">
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
                    day_selected: { backgroundColor: '#2563eb', color: 'white' },
                    day_today: { fontWeight: 700, color: '#2563eb' },
                    caption: { fontWeight: 600 },
                  }}
                />
                <div className="flex items-center justify-between px-2 pb-2 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    className="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-1 rounded-lg transition-colors"
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
