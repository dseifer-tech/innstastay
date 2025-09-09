#!/usr/bin/env node

// Usage: node -r dotenv/config scripts/check-page.js dotenv_config_path=.env.local about

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
  const slug = process.argv[2] || 'about'
  console.log('Checking page by slug:', slug, 'in', PROJECT_ID, DATASET)
  const query = `*[_type=="page" && slug.current==$slug][0]{_id, title, slug, _updatedAt}`
  const doc = await client.fetch(query, { slug })
  console.log('Found doc:', doc)
}

run().catch((e) => { console.error(e); process.exit(1) })


