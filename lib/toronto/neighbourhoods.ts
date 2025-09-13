export type Neighborhood = {
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  blurb: string;
  highlights: string[];
};

export const neighborhoods: Neighborhood[] = [
  { slug: 'entertainment-district', name: 'Entertainment District', metaTitle: 'Entertainment District Toronto — Hotels & Things To Do', metaDescription: 'Stay steps from CN Tower, Ripley\'s, Rogers Centre and Scotiabank Arena. Walkable, event‑centric, PATH nearby.', blurb: 'Best for first‑timers who want icons and arenas at your doorstep.', highlights: ['CN Tower','Ripley\'s Aquarium','Rogers Centre','Scotiabank Arena','King West dining'] },
  { slug: 'queen-west-ossington', name: 'Queen West & Ossington', metaTitle: 'Queen West & Ossington — Trendy Toronto Hotels & Eats', metaDescription: 'Boutique vibes, indie shops and some of Toronto\'s best restaurants and bars, with easy streetcar access.', blurb: 'For food lovers and nightlife, with quick transit into the core.', highlights: ['Ossington strip','Trinity Bellwoods Park','Art galleries'] },
  { slug: 'old-town-distillery', name: 'Old Town & Distillery District', metaTitle: 'Old Town & Distillery — Historic Toronto Hotels & Markets', metaDescription: 'Cobblestones, galleries and St. Lawrence Market. Great winter lights and strolls.', blurb: 'Heritage charm close to downtown.', highlights: ['St. Lawrence Market','Distillery Historic District'] },
  { slug: 'yorkville-annex', name: 'Yorkville & the Annex', metaTitle: 'Yorkville & the Annex — Museum & Shopping Hotels', metaDescription: 'Upscale shopping and cafés next to the ROM and U of T.', blurb: 'Quiet pockets with premium retail and culture.', highlights: ['Royal Ontario Museum','Mink Mile'] },
  { slug: 'harbourfront-islands', name: 'Harbourfront & Islands', metaTitle: 'Harbourfront & Toronto Islands — Waterfront Hotels', metaDescription: 'Lakefront paths, ferries and skyline views; best in summer.', blurb: 'Great for families and runners/cyclists.', highlights: ['Toronto Islands','Harbourfront Centre'] },
  { slug: 'church-wellesley-village', name: 'Church‑Wellesley Village', metaTitle: 'Church‑Wellesley Village — LGBTQ+ Friendly Hotels', metaDescription: 'Pride Month hub with inclusive venues and quick subway access.', blurb: 'Lively, welcoming, central.', highlights: ['The Village','Pride Toronto'] },
  { slug: 'financial-district-south-core', name: 'Financial District & South Core', metaTitle: 'Financial District & South Core — Business Hotels', metaDescription: 'Union Station, UP Express and the 30+ km PATH for weather‑proof access.', blurb: 'Business‑friendly and commute‑smart.', highlights: ['Union Station','Scotiabank Arena','PATH'] },
  { slug: 'kensington-chinatown', name: 'Kensington Market & Chinatown', metaTitle: 'Kensington Market & Chinatown — Foodie Hotels', metaDescription: 'Global eats, markets and murals near AGO and Queen Street.', blurb: 'Creative, delicious, walkable.', highlights: ['Kensington Market','AGO','Spadina Chinatown'] },
];
