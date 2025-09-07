#!/usr/bin/env node

// Fill downtown page hotelCarousel with featured hotels
// Usage: node -r dotenv/config scripts/fill-downtown-carousel.js dotenv_config_path=.env.local

const { createClient } = require('@sanity/client')

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const TOKEN = process.env.SANITY_API_TOKEN

if (!PROJECT_ID || !TOKEN) {
  console.error('Missing envs: NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN')
  process.exit(1)
}

const client = createClient({ projectId: PROJECT_ID, dataset: DATASET, token: TOKEN, apiVersion: '2023-05-03', useCdn: false })

async function pickFeaturedHotels() {
  // Fetch a handful of active hotels; you can refine by tags/area if modeled
  const hotels = await client.fetch(`*[_type=="hotel" && defined(slug.current) && isActive!=false][0...8]{ _id, name }`)
  return hotels.map((h) => ({ _type: 'reference', _ref: h._id }))
}

async function run() {
  console.log('Filling hotelCarousel on downtown page...')
  const refs = await pickFeaturedHotels()
  const page = await client.fetch('*[_type=="page" && slug.current=="hotels/toronto-downtown"][0]{_id, sections}')
  if (!page?._id) {
    console.error('Downtown page not found')
    process.exit(1)
  }
  const sections = Array.isArray(page.sections) ? [...page.sections] : []
  // Find first hotelCarousel section or append one
  let idx = sections.findIndex((s) => s?._type === 'hotelCarousel')
  if (idx === -1) {
    sections.push({ _type: 'hotelCarousel', title: 'Downtown picks', hotels: refs })
  } else {
    sections[idx] = { ...sections[idx], hotels: refs }
  }
  await client.patch(page._id).set({ sections }).commit()
  console.log('Updated hotelCarousel with', refs.length, 'hotels')
}

run().catch((e)=>{ console.error('Failed:', e?.message || e); process.exit(1) })
