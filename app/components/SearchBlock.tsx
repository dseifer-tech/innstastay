'use client';

import { useState, useMemo, FormEvent } from 'react';
import { Button } from '@/app/components/ui/Button';
import RangeDatePicker from '@/app/components/ui/RangeDatePicker';
import { type DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Users } from 'lucide-react';

function toYMD(d?: Date | null) {
  return d ? format(d, 'yyyy-MM-dd') : '';
}

export default function SearchBlock() {
  const [range, setRange] = useState<DateRange | undefined>({ from: undefined, to: undefined });
  const [adults, setAdults] = useState(2);
  const [loading, setLoading] = useState(false);

  const checkin  = useMemo(() => toYMD(range?.from ?? undefined), [range?.from]);
  const checkout = useMemo(() => toYMD(range?.to ?? undefined),   [range?.to]);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    // Prevent submit if dates are missing
    if (!checkin || !checkout) {
      e.preventDefault();
      // basic front-end nudge
      alert('Please choose both check-in and check-out dates.');
      return;
    }
    setLoading(true); // shows button loading & disables fields via form [disabled]
  }

  return (
    <section className="section-tint mt-6 md:mt-8 py-3">
      <div className="mx-auto max-w-5xl px-4">
        <form
          className="rounded-[20px] bg-white/90 supports-[backdrop-filter]:backdrop-blur border border-black/5 shadow-[0_8px_30px_rgba(0,0,0,.06)] p-4 md:p-5 focus-within:ring-2 focus-within:ring-blue-600"
          method="GET"
          action="/search"
          onSubmit={onSubmit}
          aria-busy={loading}
        >
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-3 items-center">
            <div className="w-full">
              <RangeDatePicker
                value={range}
                onChange={setRange}
                minDate={new Date()}
                label="Check-in date — Check-out date"
              />
            </div>

            <input type="hidden" name="checkin"  value={checkin} />
            <input type="hidden" name="checkout" value={checkout} />
            <input type="hidden" name="children" value="0" />
            <input type="hidden" name="rooms"    value="1" />

            <div className="relative">
              <Users className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                type="number"
                name="adults"
                min={1}
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                className="font-date w-full sm:w-24 rounded-xl border border-black/10 pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Adults"
                disabled={loading}
              />
            </div>

            <Button type="submit" loading={loading} disabled={loading}>
              Show Direct Rates
            </Button>
          </div>

          <p className="sr-only" aria-live="polite">
            {loading ? 'Fetching direct rates…' : ''}
          </p>
        </form>
      </div>
    </section>
  );
}