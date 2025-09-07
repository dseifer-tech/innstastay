#!/usr/bin/env node

// Seed core CMS docs: siteSettings, navigation, and basic pages
// Usage: node -r dotenv/config scripts/seed-cms.js dotenv_config_path=.env.local

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

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  token: TOKEN,
  apiVersion: '2023-05-03',
  useCdn: false,
})

async function upsert(doc) {
  if (!doc._id) throw new Error('Doc requires a stable _id')
  return client.createOrReplace(doc)
}

function pageDoc(id, title, slug, sections = []) {
  return {
    _id: id,
    _type: 'page',
    title,
    slug: { _type: 'slug', current: slug },
    sections,
  }
}

async function run() {
  console.log('Seeding CMS content to Sanity:', { projectId: PROJECT_ID, dataset: DATASET })

  const results = []

  // 1) Site Settings
  results.push(await upsert({
    _id: 'siteSettings.default',
    _type: 'siteSettings',
    gtmId: '',
    gaId: '',
    defaultSeo: {
      _type: 'seo',
      title: 'InnstaStay — Direct, commission-free hotel booking',
      description: 'Find real prices and book direct. No middlemen, no extra fees.',
    },
  }))

  // 2) Navigation
  results.push(await upsert({
    _id: 'navigation.main',
    _type: 'navigation',
    mainMenu: [
      { _type: 'object', label: 'Home', href: '/' },
      { _type: 'object', label: 'Search', href: '/search' },
      { _type: 'object', label: 'About', href: '/about' },
      { _type: 'object', label: 'Contact', href: '/contact' },
      { _type: 'object', label: 'Privacy', href: '/privacy' },
    ],
    footerMenu: [
      { _type: 'object', label: 'Privacy', href: '/privacy' },
      { _type: 'object', label: 'Contact', href: '/contact' },
    ],
  }))

  // 3) Pages
  const hero = (headline, subhead) => ({ _type: 'hero', headline, subhead })
  const rich = (body) => ({ _type: 'richText', body })
  const pt = (text) => ([{ _type: 'block', style: 'normal', children: [{ _type: 'span', text }] }])

  results.push(await upsert(pageDoc('page.home', 'Home', 'home', [
    hero('Find real hotel prices. Book direct.', 'No commissions. No markups.'),
    rich(pt('Search Toronto hotels by location and date, then book direct on the hotel site.')),
  ])))

  results.push(await upsert(pageDoc('page.about', 'About', 'about', [
    hero('About InnstaStay', 'Direct booking made transparent.'),
    rich(pt('We connect you with hotels’ official channels—so you see real prices and avoid hidden fees.')),
  ])))

  results.push(await upsert(pageDoc('page.contact', 'Contact', 'contact', [
    hero('Contact Us', 'Questions or partnerships?'),
    rich(pt('Email info@innstastay.com and we’ll get back to you.')),
  ])))

  results.push(await upsert(pageDoc('page.privacy', 'Privacy', 'privacy', [
    hero('Privacy Policy', 'We respect your privacy.'),
    rich(pt('We only collect what’s needed to operate the site and never sell your data.')),
  ])))

  console.log('Seeded docs:', results.map((d) => d._id))
}

run().catch((err) => {
  console.error('Seed failed:', err?.message || err)
  process.exit(1)
})


