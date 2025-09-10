'use client';

import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/Button';

export default function SearchBlock() {
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');
  const [adults, setAdults] = useState(2);
  const [loading, setLoading] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    setLoading(true);
    // let the browser do a normal GET submit to /search
  }

  return (
    <section className="mt-6 md:mt-8">
      <div className="mx-auto max-w-5xl px-4">
        <form
          className="rounded-2xl bg-white shadow-xl ring-1 ring-black/5 p-4 md:p-5"
          method="GET"
          action="/search"
          onSubmit={onSubmit}
          aria-busy={loading}
        >
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="date"
              name="checkin"
              value={checkin}
              onChange={(e) => setCheckin(e.target.value)}
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="yyyy-mm-dd"
              required
              disabled={loading}
            />
            <input
              type="date"
              name="checkout"
              value={checkout}
              onChange={(e) => setCheckout(e.target.value)}
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="yyyy-mm-dd"
              required
              disabled={loading}
            />
            <input
              type="number"
              name="adults"
              min={1}
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Adults"
              disabled={loading}
            />
            {/* Hidden defaults so the API always has complete params */}
            <input type="hidden" name="children" value="0" />
            <input type="hidden" name="rooms" value="1" />

            <Button
              type="submit"
              className="sm:col-span-1"
              data-loading={loading}
              disabled={loading}
            >
              {loading ? 'Searching…' : 'Show Direct Rates'}
            </Button>
          </div>

          {/* polite ARIA live region for screen readers */}
          <p className="sr-only" aria-live="polite">
            {loading ? 'Fetching direct rates…' : ''}
          </p>
        </form>
      </div>
    </section>
  );
}