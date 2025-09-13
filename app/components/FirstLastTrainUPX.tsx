'use client';
import Link from 'next/link';

export type DirectionSchedule = { first: string; last: string; headwayMins: number };

const PEARSON_TO_UNION: DirectionSchedule = { first: '05:27', last: '01:00', headwayMins: 15 };
const UNION_TO_PEARSON: DirectionSchedule = { first: '05:10', last: '01:00', headwayMins: 15 };

function toMins(hm: string) { const [h,m] = hm.split(':').map(Number); return h*60+m; }
function minsToHM(m: number) { const h = Math.floor(m/60)%24; const mm = m%60; return `${String(h).padStart(2,'0')}:${String(mm).padStart(2,'0')}`; }

function nextDeparture(nowMins: number, dir: DirectionSchedule) {
  const start = toMins(dir.first); const end = toMins(dir.last) < start ? toMins(dir.last)+24*60 : toMins(dir.last);
  let cur = nowMins;
  if (cur < start) return start;
  while (cur <= end) {
    const offset = (cur - start) % dir.headwayMins;
    if (offset === 0) return cur;
    cur += dir.headwayMins - offset;
  }
  // past last train, return next day's first
  return start + 24*60;
}

export default function FirstLastTrainUPX() {
  const now = new Date();
  const mins = now.getHours()*60 + now.getMinutes();
  const nextPearson = nextDeparture(mins, PEARSON_TO_UNION);
  const nextUnion = nextDeparture(mins, UNION_TO_PEARSON);
  return (
    <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-gray-900">UP Express — Pearson ⇄ Union</div>
          <div className="text-xs text-gray-600">Approx. every {PEARSON_TO_UNION.headwayMins} min · <Link href="https://www.upexpress.com/" target="_blank" className="text-blue-700 underline">check official schedule</Link></div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="rounded-lg bg-blue-50 px-3 py-2 text-blue-900">
            <div className="text-[11px] uppercase tracking-wide">Next from Pearson → Union</div>
            <div className="font-bold">{minsToHM(nextPearson % (24*60))}</div>
          </div>
          <div className="rounded-lg bg-blue-50 px-3 py-2 text-blue-900">
            <div className="text-[11px] uppercase tracking-wide">Next from Union → Pearson</div>
            <div className="font-bold">{minsToHM(nextUnion % (24*60))}</div>
          </div>
        </div>
      </div>
      <div className="mt-2 text-[11px] text-gray-500">First trains ~{PEARSON_TO_UNION.first} and {UNION_TO_PEARSON.first}. Last trains ~{PEARSON_TO_UNION.last} and {UNION_TO_PEARSON.last}. Exact times vary by day — always verify.</div>
    </div>
  );
}
