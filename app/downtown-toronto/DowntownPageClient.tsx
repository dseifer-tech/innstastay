'use client';

import { useMemo, useState } from 'react';
import Script from 'next/script';
import MobileMenu from '@/app/components/MobileMenu';
import SimpleHero from '@/app/components/SimpleHero';
import OptimizedImage from '@/app/components/OptimizedImage';
import { proxify } from '@/lib/img';
import {
  Train,
  MapPin,
  Landmark,
  Building2,
  CalendarDays,
  Utensils,
  Sun,
  ShieldCheck,
  Accessibility,
  BadgeDollarSign,
  Info,
  Ticket
} from 'lucide-react';

import EventBanners from '@/app/components/EventBanners';
import OpenNow from '@/app/components/OpenNow';
import FirstLastTrainUPX from '@/app/components/FirstLastTrainUPX';
import { HOURS } from '@/lib/toronto/hours';

// ----------------------------------------------------------------------------
// Downtown Toronto Landing Page (SEO-first)
// - Neighbourhood-first UX
// - Transit (UP Express / One Fare) explainer
// - Top sights + CityPASS
// - Event highlights (2025) – static copy with official links
// - Niagara day trip CTA
// - Food/MICHELIN callouts
// - Weather & seasonality tips
// - Safety & accessibility FAQs
// - Transparent taxes + ALL-IN price calculator (MAT 8.5% + HST 13%)
// - JSON-LD for WebPage, FAQPage, ItemList (neighbourhoods) & Breadcrumbs
// ----------------------------------------------------------------------------

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const NEIGHBOURHOODS = [
  {
    name: 'Entertainment District',
    vibe: ['walkable', 'events', 'PATH nearby'],
    why: 'Best for first‑timers: CN Tower, Ripley\'s, Rogers Centre and Scotiabank Arena within a short walk.',
  },
  {
    name: 'Queen West & Ossington',
    vibe: ['dining', 'nightlife', 'indie shops'],
    why: 'Trendy restaurants, bars and boutiques; easy streetcar to the core.',
  },
  {
    name: 'Old Town & Distillery District',
    vibe: ['heritage', 'markets', 'galleries'],
    why: 'Historic streets, St. Lawrence Market and Distillery cobblestones; great for strolls and winter lights.',
  },
  {
    name: 'Yorkville & the Annex',
    vibe: ['upscale', 'museums', 'shopping'],
    why: 'Near ROM and high‑end boutiques; quiet pockets with café culture.',
  },
  {
    name: 'Harbourfront & Islands',
    vibe: ['waterfront', 'views', 'family'],
    why: 'Lakefront paths, ferry to Toronto Islands, summer festivals and cruises.',
  },
  {
    name: 'Church‑Wellesley Village',
    vibe: ['LGBTQ+', 'nightlife', 'cafés'],
    why: 'Pride Month hub with inclusive venues and quick subway access.',
  },
  {
    name: 'Financial District & South Core',
    vibe: ['business', 'PATH', 'transit hub'],
    why: 'Union Station, UP Express, and the 30+ km PATH for weather‑proof access.',
  },
  {
    name: 'Kensington & Chinatown',
    vibe: ['markets', 'street food', 'arts'],
    why: 'Global eats, vintage shops and murals; easy walk to AGO and Queen West.',
  },
];

const SIGHTS = [
  {
    name: 'CN Tower',
    desc: "553 m icon with LookOut, Glass Floor and EdgeWalk.",
    near: 'Entertainment District',
    img: proxify('https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcToC6Dg8U9nucWiitonjOGkMhhIqrf6NalAdrVeYXaiQkDqBuDy', 'CN Tower'),
  },
  {
    name: "Ripley's Aquarium of Canada",
    desc: 'Shark tunnel + family favourites; open late many nights.',
    near: 'South Core',
    img: proxify('https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQoCFpB93wBlMQcUqbnrBUM1I-BIS30KwpXkEZFawxcbOjHCqj_', "Ripley's Aquarium of Canada"),
  },
  {
    name: 'St. Lawrence Market',
    desc: '100+ food vendors; peameal bacon sandwich classic.',
    near: 'Old Town',
    img: proxify('https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSNzfS0Yisnz-lksUXqnJyMsg_Oqz0b1LqBRxC_0LQ1hfXII1C6', 'St. Lawrence Market'),
  },
  {
    name: 'Royal Ontario Museum (ROM)',
    desc: 'World cultures & natural history; striking Michael Lee-Chin Crystal.',
    near: 'Yorkville',
    img: proxify('https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTm301sIsH1CmyGx9hhuENMH3Ni1yzLZJvjE6iGGfo88sCYNTWw', 'Royal Ontario Museum'),
  },
  {
    name: 'Distillery Historic District',
    desc: 'Victorian-era pedestrian village with galleries and seasonal markets.',
    near: 'Distillery District',
    img: proxify('https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcT_DhhHAloXWTAcX84ZiwdwYHjlM13s9Jsl5SlBh3qc-jzyUUM6', 'Distillery District'),
  },
  {
    name: 'Toronto Islands & Ferries',
    desc: 'Beaches, skyline views and car‑free cycling; seasonal hours.',
    near: 'Harbourfront',
    img: proxify('https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcT5in4EAwdgmFl5BBC-t_R2_Emd0JAJ-ynG1DciT5_xRScBGvmU', 'Toronto Islands'),
  },
];

const EVENTS_2025 = [
  {
    name: 'TIFF — Toronto International Film Festival',
    date: 'Sept 4–14, 2025',
    link: 'https://tiff.net',
    area: 'Entertainment District / King West',
  },
  {
    name: 'Pride Toronto — Festival Weekend',
    date: 'June 26–29, 2025 (Pride Month all June)',
    link: 'https://www.pridetoronto.com',
    area: 'Church‑Wellesley Village',
  },
  {
    name: 'Toronto Caribbean Carnival (Caribana) — Grand Parade',
    date: 'Aug 2, 2025 (festival late Jul–early Aug)',
    link: 'https://www.torontocarnival.ca',
    area: 'Exhibition Place / Lakeshore',
  },
  {
    name: 'CNE — Canadian National Exhibition',
    date: 'Aug 15 – Sept 1, 2025',
    link: 'https://www.theex.com',
    area: 'Exhibition Place',
  },
  {
    name: 'National Bank Open (Tennis)',
    date: 'Jul 26 – Aug 7, 2025',
    link: 'https://nationalbankopen.com',
    area: 'Sobeys Stadium (York University; subway to Pioneer Village + shuttle)',
  },
];

const FAQS = [
  {
    q: 'What\'s the fastest way from Pearson (YYZ) to downtown?',
    a: 'UP Express train runs every ~15 minutes and takes ~25 minutes to Union Station. Tap PRESTO or contactless card. One Fare gives free transfers between regional/TTC systems within the window. Check official sites for latest fares and service notices.',
  },
  {
    q: 'Which neighbourhood is best for first‑timers without a car?',
    a: 'Entertainment District / South Core for walkability to the CN Tower, Ripley\'s, Rogers Centre and Scotiabank Arena. Queen West & Ossington shine for dining and nightlife; Old Town & Distillery for historic vibes.',
  },
  {
    q: 'Is CityPASS worth it?',
    a: 'If you plan to visit 3–4 major attractions (CN Tower, Ripley\'s, ROM, Casa Loma, City Cruises, Zoo), CityPASS usually saves money and time. Check validity windows and timed-entry rules.',
  },
  {
    q: 'How safe is downtown and the TTC at night?',
    a: 'Toronto is generally safe with big‑city awareness. Stick to well‑lit routes, ride in staffed stations/cars, and consult official TTC/TPS updates. Event nights can be crowded — plan extra time.',
  },
  {
    q: 'Are the subway stations fully accessible?',
    a: 'Accessibility continues to improve, but not all stations have elevators. Verify station status on the TTC site before travelling. Major attractions typically offer accessible entrances and washrooms.',
  },
  {
    q: 'Do I need a visa or eTA to visit?',
    a: 'US citizens do not need an eTA. Most other visa‑exempt air travellers need a $7 eTA. ArriveCAN is not required; optional Advance CBSA Declaration can speed up arrivals.',
  },
  {
    q: 'What taxes apply to hotel stays in Toronto?',
    a: 'Expect HST (13%) and a Municipal Accommodation Tax currently 8.5% (scheduled through July 31, 2026). Always review your "all‑in" total before booking.',
  },
  {
    q: 'When are cherry blossoms and what\'s good in winter?',
    a: 'Blossoms typically late April–early May (popular in High Park). Winter is comfortable via the PATH underground network, with museums, galleries and Distillery Winter Village.',
  },
  {
    q: 'Can I visit Niagara Falls without a car?',
    a: 'Yes. GO Train from Union Station + WEGO bus in Niagara is the easiest rail/transit combo. Day tours with winery stops are popular as well.',
  },
  {
    q: 'Where should food lovers stay?',
    a: 'Queen West/Ossington, Chinatown/Kensington, and Yorkville offer dense dining. Toronto\'s MICHELIN‑recognized picks span many cuisines — book early for prime tables.',
  },
];

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-200">
      {children}
    </span>
  );
}

export default function DowntownPageClient() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // --- Tax Calculator ---
  const [rate, setRate] = useState<number | string>('199');
  const [nights, setNights] = useState<number | string>('2');
  const MAT = 0.085; // through Jul 31, 2026
  const HST = 0.13;
  const calc = useMemo(() => {
    const r = Number(rate) || 0;
    const n = Number(nights) || 0;
    const room = r * n;
    const mat = room * MAT;
    const hst = (room + mat) * HST;
    const total = room + mat + hst;
    return { room, mat, hst, total };
  }, [rate, nights]);

  return (
    <div>
      {/* JSON-LD: WebPage */}
      <Script id="jsonld-webpage" type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Downtown Toronto Hotels, Neighbourhoods & Travel Guide (2025)',
            description:
              'Neighbourhood finder, UP Express & TTC tips, CityPASS, 2025 event highlights (TIFF, Pride, Caribana, CNE), Niagara day trips, food & MICHELIN, safety/accessibility, weather and an all‑in price calculator — book direct with transparent totals.',
            url: 'https://innstastay.com/downtown-toronto',
          }),
        }}
      />

      {/* JSON-LD: FAQPage */}
      <Script id="jsonld-faq" type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />

      {/* JSON-LD: ItemList (Neighbourhoods) */}
      <Script id="jsonld-itemlist" type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: NEIGHBOURHOODS.map((n, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: n.name,
              url: `https://innstastay.com/search?neighborhood=${slugify(n.name)}`,
            })),
          }),
        }}
      />

      {/* Hero */}
      <SimpleHero
        title="Downtown Toronto: Best Neighbourhoods & Hotels — Book Direct"
        subtitle="Pick your vibe, see transit times from Pearson, plan top sights and events — then compare official hotel rates with all‑in pricing."
        theme="dark"
      />

      <EventBanners />

      {/* Breadcrumbs */}
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <li><a className="hover:underline" href="/">Home</a></li>
          <li className="text-gray-400">/</li>
          <li className="font-medium text-gray-900">Downtown Toronto</li>
        </ol>
      </nav>

      {/* Neighbourhood chooser */}
      <section id="neighbourhoods" className="py-12 sm:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-start gap-3">
            <MapPin className="mt-1 h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Find the right neighbourhood</h2>
              <p className="mt-1 text-gray-600">Filter by vibe and jump straight to hotel results near each area.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {NEIGHBOURHOODS.map((n) => (
              <a key={n.name} href={`/search?neighborhood=${slugify(n.name)}`} className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700">{n.name}</h3>
                    <p className="mt-1 text-sm text-gray-600">{n.why}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {n.vibe.map((t) => (
                        <Badge key={t}>{t}</Badge>
                      ))}
                    </div>
                  </div>
                  <Building2 className="h-8 w-8 text-gray-300" />
                </div>
                <div className="mt-4 text-sm font-medium text-blue-700">See hotels in {n.name} →</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Transit / Airport module */}
      <section id="transit" className="py-12 sm:py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-start gap-3">
            <Train className="mt-1 h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Pearson (YYZ) → Downtown in ~25 minutes</h2>
              <p className="mt-1 text-gray-600">UP Express runs every ~15 minutes to Union Station. Tap PRESTO or contactless. <a className="text-blue-700 underline" href="https://www.upexpress.com/" target="_blank" rel="noopener">Check prices & service</a>. One Fare lets you transfer between TTC/GO within the window — <a className="text-blue-700 underline" href="https://www.metrolinx.com/en/fare-systems/one-fare" target="_blank" rel="noopener">how it works</a>.</p>
            </div>
          </div>

          <div className="mb-6"><FirstLastTrainUPX /></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h3 className="font-semibold text-gray-900">From Union Station</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-700 list-disc list-inside">
                <li>Walk to CN Tower / Ripley\'s: 10–15 min</li>
                <li>Streetcar to Queen West / Ossington: 15–20 min</li>
                <li>Subway to Yorkville / ROM: ~12–15 min</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h3 className="font-semibold text-gray-900">Game & concert nights</h3>
              <p className="mt-2 text-sm text-gray-700">Trains and streetcars are busier for Leafs/Raptors/Jays/TFC. Leave extra time and consider walking routes from our map if you\'re nearby.</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h3 className="font-semibold text-gray-900">Good to know</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-700 list-disc list-inside">
                <li>Contactless tap works on TTC (no cash needed).</li>
                <li>PATH provides weather‑proof access across downtown.</li>
                <li>Ferry to Islands departs from Jack Layton Ferry Terminal.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Top sights + CityPASS */}
      <section id="sights" className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-start gap-3">
            <Landmark className="mt-1 h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Top sights & CityPASS</h2>
              <p className="mt-1 text-gray-600">Hit the icons in 1–2 days and save with <a className="text-blue-700 underline" href="https://www.citypass.com/toronto" target="_blank" rel="noopener">Toronto CityPASS</a> (CN Tower, Ripley\'s + 3 others; timed entry may apply).</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SIGHTS.map((poi) => (
              <div key={poi.name} className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
                <div className="relative mb-3 h-44 w-full overflow-hidden rounded-lg">
                  <OptimizedImage src={poi.img} alt={poi.name} fill className="object-cover" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700">{poi.name}</h3>
                <p className="mt-1 text-sm text-gray-600">{poi.desc}</p>
                {HOURS[poi.name] && <OpenNow hours={HOURS[poi.name]} tz="America/Toronto" />}
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                  <MapPin className="h-4 w-4" /> <span>Near {poi.near}</span>
                </div>
                <a href={`/search?near=${slugify(poi.name)}`} className="mt-3 inline-block text-sm font-medium text-blue-700">Find hotels near {poi.name} →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section id="events" className="py-12 sm:py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-start gap-3">
            <CalendarDays className="mt-1 h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">2025 event highlights</h2>
              <p className="mt-1 text-gray-600">Book early for city‑wide sell‑outs. Always confirm dates on official sites.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EVENTS_2025.map((e) => (
              <div key={e.name} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{e.name}</h3>
                    <p className="text-sm text-gray-600">{e.date}</p>
                    <p className="mt-1 text-xs text-gray-500">Area: {e.area}</p>
                  </div>
                  <Ticket className="h-5 w-5 text-gray-300" />
                </div>
                <a href={e.link} target="_blank" rel="noopener" className="mt-3 inline-block text-sm font-medium text-blue-700">Official site →</a>
                <div className="mt-2 text-xs text-gray-500">Tip: Use UP Express / TTC and consider walking routes on peak nights.</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Food & MICHELIN */}
      <section id="food" className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-start gap-3">
            <Utensils className="mt-1 h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Where to eat (MICHELIN & local gems)</h2>
              <p className="mt-1 text-gray-600">Book prime tables early. Explore Ossington/Queen West, Yorkville, Chinatown/Kensington and Leslieville for range and value.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['MICHELIN picks', 'Late‑night eats', 'Vegetarian/vegan', 'Patios in summer'].map((t) => (
              <div key={t} className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700">{t}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Weather & Seasonality */}
      <section id="seasonality" className="py-12 sm:py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-start gap-3">
            <Sun className="mt-1 h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Seasonality planner</h2>
              <p className="mt-1 text-gray-600">Set expectations and pack right — Toronto swings from humid summers to snowy winters.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <h3 className="font-semibold text-gray-900">Winter (Dec–Mar)</h3>
              <p className="mt-2 text-sm text-gray-700">Use the PATH to connect hotels, shops and transit. Prioritise ROM/AGO, Castle Loma tours and Distillery Winter Village.</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <h3 className="font-semibold text-gray-900">Spring (Apr–May)</h3>
              <p className="mt-2 text-sm text-gray-700">Cherry blossoms often late Apr–early May (High Park). Unpredictable showers — keep indoor backup plans.</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <h3 className="font-semibold text-gray-900">Summer (Jun–Aug)</h3>
              <p className="mt-2 text-sm text-gray-700">Waterfront/Islands shine; festivals peak. Book early around long weekends and major events.</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <h3 className="font-semibold text-gray-900">Fall (Sep–Nov)</h3>
              <p className="mt-2 text-sm text-gray-700">TIFF headlines early Sept; later months bring foliage walks and Nuit Blanche.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Accessibility */}
      <section id="sa" className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="mb-3 flex items-center gap-2 text-gray-900">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold">Safety tips</h2>
              </div>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
                <li>Prefer well‑lit routes; consider walking to venues on event nights.</li>
                <li>On TTC, sit in staffed cars and check service updates before late rides.</li>
                <li>Our desk can suggest the simplest walk‑back route for your plans.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="mb-3 flex items-center gap-2 text-gray-900">
                <Accessibility className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold">Accessibility</h2>
              </div>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
                <li>Not all subway stations have elevators — confirm station status before travelling.</li>
                <li>Major attractions (CN Tower, ROM, AGO, Ripley\'s) provide accessible entries and washrooms.</li>
                <li>Accessible room features available on request; contact us for exact door widths and shower specs.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Taxes & All‑in price calculator */}
      <section id="pricing" className="py-12 sm:py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-start gap-3">
            <BadgeDollarSign className="mt-1 h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">All‑in price calculator (Toronto)</h2>
              <p className="mt-1 text-gray-600">Includes HST (13%) and Municipal Accommodation Tax (8.5%).</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="grid grid-cols-2 gap-4">
                <label className="text-sm text-gray-700">
                  Nightly rate (CAD)
                  <input
                    type="number"
                    inputMode="decimal"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none"
                  />
                </label>
                <label className="text-sm text-gray-700">
                  Nights
                  <input
                    type="number"
                    value={nights}
                    onChange={(e) => setNights(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none"
                  />
                </label>
              </div>
              <p className="mt-3 text-xs text-gray-500">MAT rate 8.5% currently scheduled through Jul 31, 2026. Always verify your final folio.</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <dl className="grid grid-cols-2 gap-y-2 text-sm">
                <dt className="text-gray-600">Room subtotal</dt>
                <dd className="text-right font-medium text-gray-900">${calc.room.toFixed(2)}</dd>
                <dt className="text-gray-600">MAT 8.5%</dt>
                <dd className="text-right font-medium text-gray-900">${calc.mat.toFixed(2)}</dd>
                <dt className="text-gray-600">HST 13% (on room + MAT)</dt>
                <dd className="text-right font-medium text-gray-900">${calc.hst.toFixed(2)}</dd>
                <dt className="mt-2 text-gray-900 font-semibold">All‑in total</dt>
                <dd className="mt-2 text-right text-lg font-bold text-gray-900">${calc.total.toFixed(2)}</dd>
              </dl>
              <a href="/search" className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700">Compare direct rates →</a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-start gap-3">
            <Info className="mt-1 h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Toronto FAQs</h2>
              <p className="mt-1 text-gray-600">Real planning questions answered — visas/eTA, transit, passes, and seasons.</p>
            </div>
          </div>

          <div className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
            {FAQS.map((f) => (
              <details key={f.q} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4">
                  <span className="font-medium text-gray-900 group-open:text-blue-700">{f.q}</span>
                  <span className="text-gray-400">+</span>
                </summary>
                <div className="px-5 pb-5 text-sm text-gray-700">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Niagara day trip CTA */}
      <section id="niagara" className="py-12 sm:py-16 bg-blue-50/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Niagara Falls — easy day trip</h2>
              <p className="mt-1 text-gray-700">GO Train from Union + WEGO bus gets you to the brink without a car. Add a late check‑out and breakfast for a smooth day.</p>
            </div>
            <a href="/search?near=niagara-falls" className="mt-3 inline-flex items-center rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700">
              Plan my Niagara day →
            </a>
          </div>
        </div>
      </section>

      {/* Mobile Menu (if used in layout) */}
      <MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />
    </div>
  );
}