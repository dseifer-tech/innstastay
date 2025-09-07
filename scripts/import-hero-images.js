#!/usr/bin/env node

// Upload local hero images from public/hero/* to Sanity, then set page.hero.image
// Usage: node -r dotenv/config scripts/import-hero-images.js dotenv_config_path=.env.local

const { createClient } = require('@sanity/client')
const fs = require('fs')
const path = require('path')

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const TOKEN = process.env.SANITY_API_TOKEN

if (!PROJECT_ID || !TOKEN) {
  console.error('Missing envs: NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN')
  process.exit(1)
}

const client = createClient({ projectId: PROJECT_ID, dataset: DATASET, token: TOKEN, apiVersion: '2023-05-03', useCdn: false })

const ROOT = process.cwd()
const HERO_DIR = path.join(ROOT, 'public', 'hero')

const PAGE_MAP = [
  { slug: 'home', file: 'homepage.jpg' },
  { slug: 'about', file: 'about.jpg' },
  { slug: 'hotels/toronto-downtown', file: 'toronto-downtown.jpg' },
]

async function uploadLocal(filepath, filename) {
  const stream = fs.createReadStream(filepath)
  const asset = await client.assets.upload('image', stream, { filename })
  return asset
}

async function upsertHeroImage(slug, assetId) {
  const page = await client.fetch('*[_type=="page" && slug.current==$slug][0]{_id, hero}', { slug })
  if (!page?._id) {
    console.log('Page not found for slug', slug, '- creating minimal doc')
    const created = await client.create({ _type: 'page', _id: `page.${slug.replace(/\//g,'-')}` , title: slug, slug: { _type:'slug', current: slug }, hero: { _type:'hero', headline: '', image: { _type:'image', asset: { _type:'reference', _ref: assetId } } }, sections: [] })
    return created._id
  }
  const nextHero = Object.assign({}, page.hero || { _type:'hero' }, { image: { _type:'image', asset: { _type:'reference', _ref: assetId } } })
  const res = await client.patch(page._id).set({ hero: nextHero }).commit()
  return res._id
}

async function run() {
  console.log('Importing hero images from', HERO_DIR)
  for (const item of PAGE_MAP) {
    const filepath = path.join(HERO_DIR, item.file)
    if (!fs.existsSync(filepath)) {
      console.log('Skip missing file', filepath)
      continue
    }
    try {
      const asset = await uploadLocal(filepath, item.file)
      await upsertHeroImage(item.slug, asset._id)
      console.log('✓ Set hero image for', item.slug)
    } catch (e) {
      console.error('✗ Failed for', item.slug, e?.message || e)
    }
  }
  console.log('Done.')
}

run().catch((e)=>{ console.error('Import failed:', e?.message || e); process.exit(1) })


