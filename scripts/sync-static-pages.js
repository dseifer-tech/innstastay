#!/usr/bin/env node

// ⚠️ DEPRECATED: This script is no longer needed as marketing pages are now static React components
// Pages (About, Contact, Privacy) are coded directly in app/ directory and don't use CMS
// 
// Legacy usage: node -r dotenv/config scripts/sync-static-pages.js dotenv_config_path=.env.local

const { createClient } = require('@sanity/client')
const crypto = require('crypto')

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
const pt = (text) => {
  const key = (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2))
  const childKey = (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2))
  return [{ _key: key, _type: 'block', style: 'normal', children: [{ _key: childKey, _type: 'span', text }] }]
}

async function upsertBySlug(slug, title, sections) {
  const existing = await client.fetch(`*[_type=="page" && slug.current==$slug][0]{_id}`, { slug })
  const _id = existing?._id || `page.${slug.replace(/\//g,'-')}`
  const withKeys = (arr=[]) => arr.map((it)=> ({ _key: it._key || (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)), ...it }))
  return client.createOrReplace({ _id, _type: 'page', title, slug: { _type: 'slug', current: slug }, sections: withKeys(sections) })
}

async function run() {
  console.log('Syncing About/Contact/Privacy pages...')

  await upsertBySlug('about', 'About', [
    { _type: 'hero', headline: 'About InnstaStay', subhead: 'Direct booking made transparent.' },
    { _type: 'richText', body: pt("We're revolutionizing hotel booking by connecting travelers directly with verified hotels—no middlemen, no fees.") },
  ])

  await upsertBySlug('contact', 'Contact', [
    { _type: 'hero', headline: 'Get in touch', subhead: "We're here to help with bookings, partnerships, or support." },
    { _type: 'richText', body: pt('Email info@innstastay.com • We typically reply within one business day.') },
  ])

  await upsertBySlug('privacy', 'Privacy', [
    { _type: 'hero', headline: 'Privacy Policy', subhead: 'We respect your privacy.' },
    { _type: 'richText', body: pt('We only collect what’s needed to operate the site and never sell your data.') },
  ])

  console.log('Done.')
}

run().catch((e)=>{ console.error('Sync failed:', e?.message || e); process.exit(1) })


