#!/usr/bin/env node

// Upsert CMS pages (home, about, contact, hotels/toronto-downtown) with hero + sections
// Usage: node -r dotenv/config scripts/seed-pages-exact.js dotenv_config_path=.env.local

const { createClient } = require('@sanity/client')

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const TOKEN = process.env.SANITY_API_TOKEN

if (!PROJECT_ID || !TOKEN) {
  console.error('Missing env: NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN')
  process.exit(1)
}

const client = createClient({ projectId: PROJECT_ID, dataset: DATASET, token: TOKEN, apiVersion: '2023-10-01', useCdn: false })

const pt = (text, style = 'normal') => [{ _type: 'block', style, children: [{ _type: 'span', text }] }]

const hero = ({ title, subtitle, imageUrl, cta }) => ({
  _type: 'hero',
  headline: title,
  subhead: subtitle,
  image: imageUrl ? { asset: { url: imageUrl } } : undefined,
  cta: cta?.href ? { href: cta.href, label: cta.label || 'Learn more' } : undefined,
})

const rich = (blocks) => ({ _type: 'richText', body: blocks })

const cta = ({ heading, description, label, href }) => ({
  _type: 'secondaryCta',
  title: heading || '',
  subtitle: description || '',
  buttonLabel: label || 'Learn more',
  href: href || '#',
})

const faq = ({ heading, items }) => ({ _type: 'faq', title: heading || 'FAQ', items: items || [] })

function pageDoc(id, title, slug, heroBlock, sections) {
  return {
    _id: id,
    _type: 'page',
    title,
    slug: { _type: 'slug', current: slug },
    hero: heroBlock,
    sections,
  }
}

async function run() {
  console.log('Seeding exact pages → project:', PROJECT_ID, 'dataset:', DATASET)

  const docs = []

  // Home
  docs.push(
    pageDoc(
      'page.home',
      'Home',
      'home',
      hero({ title: 'Toronto stays, minus the OTA nonsense', subtitle: 'Real rooms, real prices, right from the hotel.' }),
      [
        rich(pt('InnstaStay connects you directly with hotels. No hidden markups, no ping-pong between OTA and hotel.')),
        cta({ heading: 'Ready to compare hotels?', description: 'Browse downtown Toronto stays and book direct.', label: 'See Toronto hotels', href: '/hotels/toronto-downtown' }),
      ]
    )
  )

  // About
  docs.push(
    pageDoc(
      'page.about',
      'About',
      'about',
      hero({ title: 'Fair, transparent hotel booking', subtitle: 'We route bookings straight to the hotel and keep pricing honest.' }),
      [
        rich([ ...pt('What InnstaStay does', 'h2'), ...pt("We partner with hotels to show their real rooms, rates, and policies. When you book, the hotel receives it directly.") ]),
        faq({ heading: 'FAQ', items: [ { question: 'Is InnstaStay an OTA?', answer: 'No. We’re a direct-booking platform. Hotels subscribe; guests book direct.' }, { question: 'Do prices match the hotel site?', answer: 'Yes—rates are provided by the hotel. If you see a mismatch, tell us.' } ] }),
        cta({ heading: 'Compare downtown Toronto stays', label: 'Browse hotels', href: '/hotels/toronto-downtown' }),
      ]
    )
  )

  // Contact
  docs.push(
    pageDoc(
      'page.contact',
      'Contact',
      'contact',
      hero({ title: 'Contact InnstaStay', subtitle: 'Questions, feedback, partnerships—let’s talk.' }),
      [
        rich([ ...pt('Email: hello@innstastay.com'), ...pt('For hotels: partners@innstastay.com') ]),
        cta({ heading: 'Hotel in Toronto?', description: 'List your property with transparent, guest-friendly booking.', label: 'Become a partner', href: '/contact#partners' }),
      ]
    )
  )

  // Toronto Downtown
  docs.push(
    pageDoc(
      'page.hotels-toronto-downtown',
      'Toronto Downtown Hotels',
      'hotels/toronto-downtown',
      hero({ title: 'Downtown Toronto', subtitle: 'Stay close to the action—CN Tower, ROM, Harbourfront, and more.' }),
      [
        rich(pt('Hand-picked independent hotels that actually get your booking—no third-party runaround.', 'normal')),
        cta({ heading: 'Compare partner hotels', label: 'See hotels', href: '/search?city=toronto' }),
      ]
    )
  )

  for (const d of docs) {
    await client.createOrReplace(d)
    console.log('Upserted:', d._id)
  }
}

run().catch((e) => { console.error(e); process.exit(1) })


