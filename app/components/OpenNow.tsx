'use client';

type Range = { open: string; close: string }; // "HH:mm" 24h
export type Hours = { [weekday: number]: Range[] }; // 0=Sun..6=Sat

function toMinutes(hm: string): number { const [h, m] = hm.split(':').map(Number); return h * 60 + m; }

export default function OpenNow({ hours, tz = 'America/Toronto' }: { hours: Hours; tz?: string }) {
  // Note: uses browser local time; ideally adjust for tz on server.
  const now = new Date();
  const dow = now.getDay();
  const curMins = now.getHours() * 60 + now.getMinutes();
  const todays = hours[dow] || [];
  let open = false; let until: string | null = null;
  for (const r of todays) {
    const start = toMinutes(r.open); const end = toMinutes(r.close);
    if (start <= curMins && curMins < end) { open = true; until = r.close; break; }
  }
  const label = open ? `Open now · until ${until}` : 'Closed now';
  return (
    <div className={`mt-2 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${open ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-gray-50 text-gray-700 ring-gray-200'}`}>
      {label}
    </div>
  );
}
