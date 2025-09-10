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
                  selected={range}
                  onSelect={(r) => {
                    if (!r?.from) {
                      setRange({ from: undefined, to: undefined });
                      return;
                    }
                    // If user clicks a single day twice, set a 1-night default
                    if (r?.from && r?.to && isAfter(r.to, r.from)) {
                      setRange(r);
                      // defer close slightly for good UX
                      setTimeout(() => close(), 80);
                    } else if (r?.from && !r?.to) {
                      setRange({ from: r.from, to: addDays(r.from, 1) });
                    }
                  }}
                  numberOfMonths={months}
                  disabled={disabledDays}
                  defaultMonth={range?.from ?? new Date()}
                />
                <div className="flex items-center justify-between px-2 pb-2">
                  <button
                    type="button"
                    className="text-xs text-gray-600 hover:text-gray-900 underline"
                    onClick={() => setRange({ from: undefined, to: undefined })}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                    onClick={() => close()}
                  >
                    Close
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
