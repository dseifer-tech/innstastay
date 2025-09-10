'use client';

import { useState } from 'react';

export default function SearchBlock() {
  const [dates, setDates] = useState<{in?: string; out?: string}>({});
  const [guests, setGuests] = useState(2);
  const [neighborhood, setNeighborhood] = useState('');

  const handleSearch = () => {
    const q = new URLSearchParams({ 
      city: 'toronto', 
      in: dates.in || '', 
      out: dates.out || '', 
      guests: String(guests), 
      n: neighborhood 
    });
    window.location.href = `/search?${q.toString()}`;
  };

  return (
    <section className="bg-white">
      <div className="container mx-auto px-4 mt-6 md:mt-8">
        <div className="rounded-2xl bg-white shadow-xl ring-1 ring-black/5 p-4 md:p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input 
              className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Check-in" 
              type="date" 
              onChange={(e) => setDates(d => ({...d, in: e.target.value}))}
            />
            <input 
              className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Check-out" 
              type="date" 
              onChange={(e) => setDates(d => ({...d, out: e.target.value}))}
            />
            <input 
              className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Neighborhood (Yorkville, Entertainment…)" 
              value={neighborhood} 
              onChange={(e) => setNeighborhood(e.target.value)} 
            />
            <div className="flex flex-col md:flex-row items-center gap-2">
              <input 
                className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                type="number" 
                min={1} 
                value={guests} 
                placeholder="Guests"
                onChange={(e) => setGuests(+e.target.value)} 
              />
              <button 
                className="w-full md:w-auto rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 shadow-lg transition-colors"
                onClick={handleSearch}
              >
                Show Direct Rates
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
