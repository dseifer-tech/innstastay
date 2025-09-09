#!/usr/bin/env ts-node
import sanityClient from '@sanity/client'
import fs from 'node:fs'

const {
  NEXT_PUBLIC_SANITY_PROJECT_ID: projectId,
  NEXT_PUBLIC_SANITY_DATASET: dataset = 'production',
  SANITY_API_TOKEN: token,
} = process.env

if (!projectId || !token) {
  console.error('Missing envs: NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN')
  process.exit(1)
}

const client = sanityClient({ projectId, dataset, token, apiVersion: '2023-10-01', useCdn: false })

type Cta = { label: string; href: string; variant?: string }
type Hero = { _type: 'hero'; eyebrow?: string; title?: string; subtitle?: string; ctas?: Cta[] }

type Page = {
  slug: string
  hero?: Hero
  sections: any[]
}

async function upsertPage(p: Page) {
  const _id = `page.${p.slug.replace(/\//g,'-')}`
  const title = p.slug === 'home' ? 'Home' : p.slug.split('/').slice(-1)[0].replace(/-/g,' ').replace(/\b\w/g, (c) => c.toUpperCase())
  const doc = {
    _id,
    _type: 'page',
    title,
    slug: { _type: 'slug', current: p.slug },
    hero: p.hero,
    sections: p.sections?.filter(Boolean) ?? [],
  }
  await client.createIfNotExists({ _id, _type: 'page', slug: doc.slug, title: doc.title })
  await client.patch(_id).set(doc).commit()
  console.log('Upserted', p.slug)
}

async function run() {
  const input = fs.readFileSync(0, 'utf8')
  const pages = JSON.parse(input) as Page[]
  for (const p of pages) await upsertPage(p)
}

run().catch((e)=>{ console.error(e); process.exit(1) })


