#!/usr/bin/env node

// Download external imageUrl for each POI, upload to Sanity asset, and set the image field
// Usage: node -r dotenv/config scripts/backfill-poi-images.js dotenv_config_path=.env.local

const { createClient } = require('@sanity/client')
const fetch = require('node-fetch')

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const TOKEN = process.env.SANITY_API_TOKEN

if (!PROJECT_ID || !TOKEN) {
  console.error('Missing envs: NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN')
  process.exit(1)
}

const client = createClient({ projectId: PROJECT_ID, dataset: DATASET, token: TOKEN, apiVersion: '2023-05-03', useCdn: false })

async function uploadImageFromUrl(url, filename) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
  const buf = await res.arrayBuffer()
  const asset = await client.assets.upload('image', Buffer.from(buf), { filename })
  return asset
}

async function run() {
  console.log('Backfilling POI images into Sanity assets...')
  const pois = await client.fetch('*[_type=="poi" && imageUrl!=null && !defined(image.asset)]{_id, name, imageUrl}')
  console.log('To upload:', pois.length)
  for (const poi of pois) {
    try {
      const asset = await uploadImageFromUrl(poi.imageUrl, `${poi._id.replace('poi.','')}.jpg`)
      await client.patch(poi._id).set({ image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } } }).commit()
      console.log('✓ Uploaded', poi.name)
    } catch (e) {
      console.log('✗ Failed', poi.name, '-', e.message)
    }
  }
  console.log('Done.')
}

run().catch((e)=>{ console.error('Backfill failed:', e?.message || e); process.exit(1) })


