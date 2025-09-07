#!/usr/bin/env node

// Publish the draft homepage document by copying drafts.page.home to page.home
// Usage: node -r dotenv/config scripts/publish-homepage.js dotenv_config_path=.env.local

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

async function run() {
  console.log('Publishing homepage draft → published...')
  const draft = await client.fetch('*[_id == "drafts.page.home"][0]')
  if (!draft) {
    console.log('No draft found for drafts.page.home')
    return
  }
  const { _id, _rev, _createdAt, _updatedAt, ...rest } = draft
  // Copy draft content into the published document
  await client.createOrReplace({ _id: 'page.home', _type: 'page', ...rest })
  // Remove the draft
  await client.delete('drafts.page.home').catch(() => {})
  console.log('Published page.home')
}

run().catch((err) => {
  console.error('Publish failed:', err?.message || err)
  process.exit(1)
})


