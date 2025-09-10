'use client';

import { useState, FormEvent } from 'react';
import { Button } from '@/app/components/ui/Button';

export default function SearchBlock() {
  // Set default dates to tomorrow and day after
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);
  
  const [checkin, setCheckin] = useState(tomorrow.toISOString().split('T')[0]);
  const [checkout, setCheckout] = useState(dayAfter.toISOString().split('T')[0]);
  const [adults, setAdults] = useState(2);
  const [loading, setLoading] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    // Don't prevent default - let browser submit naturally
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    console.log('🔍 Form data entries:');
    for (const [key, value] of formData.entries()) {
      console.log(`  ${key}: ${value}`);
    }
    
    // Build URL manually and navigate as backup
    const params = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      if (value) { // Only add non-empty values
        params.append(key, value.toString());
      }
    }
    const manualUrl = `/search?${params.toString()}`;
    console.log('🌐 Manual URL:', manualUrl);
    
    // Prevent default and navigate manually since form submission seems broken
    e.preventDefault();
    setLoading(true);
    window.location.href = manualUrl;
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
          {/* Debug display */}
          <div className="mb-3 text-xs text-gray-500 bg-gray-50 p-2 rounded">
            DEBUG: checkin={checkin}, checkout={checkout}, adults={adults}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="date"
              name="checkin"
              defaultValue={checkin}
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="yyyy-mm-dd"
              required
              disabled={loading}
            />
            <input
              type="date"
              name="checkout"
              defaultValue={checkout}
              className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="yyyy-mm-dd"
              required
              disabled={loading}
            />
            <input
              type="number"
              name="adults"
              min={1}
              defaultValue={adults}
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