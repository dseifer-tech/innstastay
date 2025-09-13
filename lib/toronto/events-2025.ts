export type EventItem = {
  slug: string;
  name: string;
  short: string;
  start: string; // ISO YYYY-MM-DD
  end: string;   // ISO YYYY-MM-DD
  displayDate: string;
  url: string;
  area: string;
};

export const events2025: EventItem[] = [
  {
    slug: 'tiff',
    name: 'Toronto International Film Festival',
    short: 'TIFF',
    start: '2025-09-04',
    end: '2025-09-14',
    displayDate: 'Sept 4–14, 2025',
    url: 'https://tiff.net',
    area: 'Entertainment District / King West',
  },
  {
    slug: 'pride',
    name: 'Pride Toronto — Festival Weekend',
    short: 'Pride Weekend',
    start: '2025-06-26',
    end: '2025-06-29',
    displayDate: 'June 26–29, 2025',
    url: 'https://www.pridetoronto.com',
    area: 'Church‑Wellesley Village',
  },
  {
    slug: 'caribana',
    name: 'Toronto Caribbean Carnival (Caribana)',
    short: 'Caribana',
    start: '2025-07-27',
    end: '2025-08-04',
    displayDate: 'Late Jul – early Aug (Parade Aug 2, 2025)',
    url: 'https://www.torontocarnival.ca',
    area: 'Exhibition Place / Lakeshore',
  },
  {
    slug: 'cne',
    name: 'Canadian National Exhibition',
    short: 'CNE',
    start: '2025-08-15',
    end: '2025-09-01',
    displayDate: 'Aug 15 – Sept 1, 2025',
    url: 'https://www.theex.com',
    area: 'Exhibition Place',
  },
  {
    slug: 'nbo',
    name: 'National Bank Open (ATP/WTA)',
    short: 'National Bank Open',
    start: '2025-07-26',
    end: '2025-08-07',
    displayDate: 'Jul 26 – Aug 7, 2025',
    url: 'https://nationalbankopen.com',
    area: 'York University / Downsview',
  },
];
