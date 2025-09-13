import type { Metadata } from 'next';
import DowntownPageClient from './DowntownPageClient';

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Downtown Toronto Hotels & Neighbourhood Guide (2025) | Book Direct';
  const description = 'Neighbourhood chooser, UP Express & TTC tips, top sights & CityPASS, 2025 events (TIFF, Pride, Caribana, CNE), Niagara day trips, MICHELIN dining, safety & accessibility, and an all‑in price calculator.';
  const url = 'https://innstastay.com/downtown-toronto';
  return {
    title,
    description,
    alternates: { canonical: url },
    keywords: ['Downtown Toronto hotels','where to stay in Toronto','UP Express','CityPASS Toronto','TIFF 2025','Pride Toronto','Caribana','CNE','Niagara day trip','Toronto MICHELIN restaurants'],
    openGraph: {
      title,
      description,
      url,
      siteName: 'InnstaStay',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description },
    other: { 'og:locale': 'en_CA' },
  };
}

export const dynamic = 'force-static';

export default function Page() { return <DowntownPageClient />; }