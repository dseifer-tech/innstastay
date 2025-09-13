import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { neighborhoods } from '@/lib/toronto/neighbourhoods';

export async function generateStaticParams() {
  return neighborhoods.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const n = neighborhoods.find((x) => x.slug === params.slug);
  if (!n) return { title: 'Neighbourhood — Toronto' };
  const url = `https://innstastay.com/downtown-toronto/neighbourhoods/${n.slug}`;
  return {
    title: n.metaTitle,
    description: n.metaDescription,
    alternates: { canonical: url },
    openGraph: { title: n.metaTitle, description: n.metaDescription, url, type: 'website', siteName: 'InnstaStay' },
  };
}

export default function NeighborhoodPage({ params }: { params: { slug: string } }) {
  const n = neighborhoods.find((x) => x.slug === params.slug);
  if (!n) return <div className="mx-auto max-w-3xl p-6"><h1 className="text-2xl font-bold">Neighbourhood not found</h1></div>;
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <Script id="jsonld-neighbourhood" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'TouristDestination', name: n.name,
        url: `https://innstastay.com/downtown-toronto/neighbourhoods/${n.slug}`,
        description: n.metaDescription,
        areaServed: 'Toronto, ON, Canada'
      }) }} />
      <nav className="mb-6 text-sm text-gray-600"><Link className="hover:underline" href="/">Home</Link> <span className="text-gray-400">/</span> <Link className="hover:underline" href="/downtown-toronto">Downtown Toronto</Link> <span className="text-gray-400">/</span> <span className="font-medium text-gray-900">{n.name}</span></nav>
      <h1 className="text-3xl font-bold text-gray-900">{n.name} — where to stay & what to do</h1>
      <p className="mt-2 text-gray-700 max-w-3xl">{n.blurb}</p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-gray-900">Highlights</h2>
          <ul className="mt-2 list-disc list-inside text-sm text-gray-700">
            {n.highlights.map(h => <li key={h}>{h}</li>)}
          </ul>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-gray-900">Stay nearby</h2>
          <p className="mt-2 text-sm text-gray-700">See hotels in {n.name}, sorted by walk time.</p>
          <Link href={`/search?neighborhood=${n.slug}`} className="mt-3 inline-block rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Search {n.name} hotels →</Link>
        </div>
      </div>
    </div>
  );
}
