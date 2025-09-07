#!/usr/bin/env node

// Sync Secondary CTA and FAQ blocks onto the home page from current hardcoded copy
// Usage: node -r dotenv/config scripts/sync-homepage-cta-faq.js dotenv_config_path=.env.local

const { createClient } = require('@sanity/client')

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const TOKEN = process.env.SANITY_API_TOKEN

if (!PROJECT_ID) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
  process.exit(1)
}
if (!TOKEN) {
  console.error('Missing SANITY_API_TOKEN (needs write access)')
  process.exit(1)
}

const client = createClient({ projectId: PROJECT_ID, dataset: DATASET, token: TOKEN, apiVersion: '2023-05-03', useCdn: false })

async function run() {
  console.log('Syncing Secondary CTA and FAQ onto page.home ...')

  // Fetch existing home page
  const home = await client.fetch(`*[_type=="page" && slug.current=="home"][0]{_id, sections}`)
  const _id = home?._id || 'page.home'

  // Build blocks from the current hardcoded components' default copy
  const secondaryCta = {
    _type: 'secondaryCta',
    title: 'Ready to Find Your Perfect Stay?',
    subtitle: "Compare live rates from Toronto's top hotels in seconds.",
    buttonLabel: 'Compare Rates Now',
    href: '/search',
  }

  const faq = {
    _type: 'faq',
    title: 'Frequently Asked Questions',
    items: [
      { _type: 'object', question: 'Do I still get loyalty points?', answer: 'Yes. You book direct with the hotel and keep all loyalty benefits, points, and member perks.' },
      { _type: 'object', question: 'Are there fees to use InnstaStay?', answer: "No fees. We show the hotel's actual price with 0% commission. What you see is what you pay." },
      { _type: 'object', question: 'Where do your prices come from?', answer: "Direct from the hotel's own booking system in real time via Google's Hotel API." },
      { _type: 'object', question: 'How is this different from other booking sites?', answer: "We don't add commissions or markups. You see the hotel's real rate and book directly with them." },
      { _type: 'object', question: 'What if I need to cancel or change my booking?', answer: 'You\'ll work directly with the hotel using their cancellation and modification policies.' },
    ],
  }

  // Prepare new sections: append or replace existing blocks of same type
  const current = Array.isArray(home?.sections) ? [...home.sections] : []
  const filtered = current.filter((s) => s?._type !== 'secondaryCta' && s?._type !== 'faq')
  filtered.push(secondaryCta)
  filtered.push(faq)

  if (!home?._id) {
    await client.create({ _id, _type: 'page', title: 'Home', slug: { _type: 'slug', current: 'home' }, sections: filtered })
    console.log('Created page.home with CTA and FAQ')
    return
  }

  const res = await client.patch(_id).set({ sections: filtered }).commit()
  console.log('Patched:', res._id, '— added/updated Secondary CTA + FAQ')
}

run().catch((e) => { console.error('Sync failed:', e?.message || e); process.exit(1) })


