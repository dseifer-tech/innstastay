"use client";

import { useState, useMemo, FormEvent } from 'react';
import { Button } from '@/app/components/ui/Button';
import RangeDatePicker from '@/app/components/ui/RangeDatePicker';
import { type DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Users } from 'lucide-react';

function toYMD(d?: Date | null) {
  return d ? format(d, 'yyyy-MM-dd') : '';
}

type Props = {
  title: string;
  subtitle?: string;
  /** "dark" = light text on dark bg, "light" = dark text on light bg */
  theme?: "dark" | "light";
  className?: string;
};

export default function HeroSearch({
  title,
  subtitle,
  theme = "dark",
  className = "",
}: Props) {
  const isDark = theme === "dark";
  
  // Search state
  const [range, setRange] = useState<DateRange | undefined>({ from: undefined, to: undefined });
  const [adults, setAdults] = useState(2);
  const [loading, setLoading] = useState(false);

  const checkin  = useMemo(() => toYMD(range?.from ?? undefined), [range?.from]);
  const checkout = useMemo(() => toYMD(range?.to ?? undefined),   [range?.to]);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    // Prevent submit if dates are missing
    if (!checkin || !checkout) {
      e.preventDefault();
      alert('Please choose both check-in and check-out dates.');
      return;
    }
    setLoading(true);
  }
  return (
    <section
      className={[
        "relative w-full",
        // shorter, more compact height
        "min-h-[320px] md:min-h-[380px]",
        // soft gradient background
        isDark
          ? "bg-gradient-to-b from-slate-600 via-slate-700 to-slate-600"
          : "bg-gradient-to-b from-slate-50 via-white to-white",
        className,
      ].join(" ")}
      aria-label="Find direct hotel rates in Toronto"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Copy block */}
        <div className="pt-8 md:pt-10 lg:pt-12 text-center">
          <h1
            className={`font-bold leading-tight tracking-tight 
              text-2xl md:text-4xl 
              ${isDark ? "text-white" : "text-neutral-900"}`}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className={`mt-3 md:mt-4 text-base md:text-xl 
                ${isDark ? "text-white/80" : "text-neutral-600"}`}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Search card */}
        <div className="relative z-10 mx-auto mt-6 md:mt-8 w-[min(1200px,96vw)]">
          <div className="rounded-2xl bg-white ring-1 ring-black/5 shadow-[0_16px_50px_rgba(2,6,23,0.12)] p-6 md:p-8">
            <form
              method="GET"
              action="/search"
              onSubmit={onSubmit}
              aria-busy={loading}
              className="space-y-4"
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
        </div>

        {/* Trust row (optional) */}
        <div
          className={`mt-5 md:mt-6 text-sm text-center 
            ${isDark ? "text-white/70" : "text-neutral-500"}`}
        >
          Direct hotel confirmation • No commissions • Clear rates
        </div>
      </div>
    </section>
  );
}
