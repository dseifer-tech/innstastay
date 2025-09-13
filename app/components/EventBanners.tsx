'use client';
import { CalendarDays, MapPin } from 'lucide-react';
import { events2025 } from '@/lib/toronto/events-2025';

export default function EventBanners({ now = new Date() }: { now?: Date }) {
  const today = new Date(now);
  const active = events2025.filter(e => new Date(e.start) <= today && today <= new Date(e.end));
  if (active.length === 0) return null;
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl mx-auto max-w-7xl mt-4 px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-start gap-2 text-amber-800">
        <CalendarDays className="h-5 w-5" />
        <div>
          <p className="font-semibold">Heads up: {active.map(a => a.short).join(' • ')}</p>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3">
            {active.map(a => (
              <a key={a.slug} href={a.url} target="_blank" rel="noopener" className="rounded-lg bg-white/70 border border-amber-200 p-3 text-sm hover:bg-white">
                <div className="font-medium">{a.name}</div>
                <div className="text-amber-700">{a.displayDate}</div>
                <div className="mt-1 flex items-center gap-1 text-amber-700">
                  <MapPin className="h-4 w-4" /> <span>{a.area}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
