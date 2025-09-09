#!/usr/bin/env ts-node

/**
 * Extracts EXACT visible strings from client pages & SectionRenderer-prop usage
 * and emits a normalized JSON payload we can upsert to Sanity page docs.
 *
 * Targets:
 *  - app/page.tsx (HomePageClient if present or inline sections)
 *  - app/about/AboutPageClient.tsx
 *  - app/contact/ContactPageClient.tsx
 *  - app/hotels/toronto-downtown/DowntownPageClient.tsx
 *
 * Strategy:
 *  - Parse files with @babel/parser (TSX)
 *  - Traverse JSX to collect:
 *     - <Hero title= subtitle= eyebrow= ... />
 *     - <FAQ ...> / accordion items (Q/A)
 *     - CTA/button group labels/links
 *     - <Prose/Portable> blocks (JSX text nodes)
 *  - Also catch JSXText nodes inside <p>, <h1-3>, <li> used in client pages
 *  - Normalize into { slug, hero, sections[] } matching our Sanity schema
 */

import fs from 'node:fs'
import path from 'node:path'
import * as babel from '@babel/parser'
import traverse from '@babel/traverse'
import * as t from '@babel/types'

type Cta = { label: string; href: string; variant?: string }
type Hero = { _type: 'hero'; eyebrow?: string; title?: string; subtitle?: string; ctas?: Cta[] }
type RichText = { _type: 'richText'; centered?: boolean; maxWidth?: string; content: any[] }
type CtaSection = { _type: 'cta'; heading?: string; description?: string; align?: 'left'|'center'|'right'; ctas: Cta[] }
type FaqItem = { question: string; answer: any[] }
type FaqList = { _type: 'faqList'; heading?: string; items: FaqItem[] }
type FeatureGrid = { _type: 'featureGrid'; heading?: string; subheading?: string; items: { icon?: string; title: string; description?: string; href?: string }[] }

type PageDoc = {
  slug: string
  hero?: Hero
  sections: Array<Hero | RichText | CtaSection | FaqList | FeatureGrid>
}

// Helpers
const PT = (text: string) => [{ _type: 'block', style: 'normal', children: [{ _type: 'span', text }]}]

function getAttrString(node: t.JSXOpeningElement, name: string) {
  const attr = node.attributes.find((a) => t.isJSXAttribute(a) && t.isJSXIdentifier(a.name, { name })) as t.JSXAttribute | undefined
  if (!attr || !attr.value) return undefined
  if (t.isStringLiteral(attr.value)) return attr.value.value
  if (t.isJSXExpressionContainer(attr.value) && t.isStringLiteral(attr.value.expression)) return attr.value.expression.value
  return undefined
}

function getAttrBoolean(node: t.JSXOpeningElement, name: string) {
  const attr = node.attributes.find((a) => t.isJSXAttribute(a) && t.isJSXIdentifier(a.name, { name })) as t.JSXAttribute | undefined
  if (!attr) return undefined
  if (!attr.value) return true // boolean shorthand present
  if (t.isJSXExpressionContainer(attr.value) && t.isBooleanLiteral(attr.value.expression)) return attr.value.expression.value
  return undefined
}

function collectJsxText(node: t.JSXElement): string[] {
  const out: string[] = []
  (node.children || []).forEach((c) => {
    if (t.isJSXText(c)) {
      const val = c.value.replace(/\s+/g,' ').trim()
      if (val) out.push(val)
    } else if (t.isJSXElement(c)) {
      out.push(...collectJsxText(c))
    }
  })
  return out
}

function parseTsx(filePath: string) {
  const code = fs.readFileSync(filePath, 'utf8')
  return babel.parse(code, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx', 'decorators-legacy', 'classProperties', 'objectRestSpread'],
  })
}

function extractFromFile(filePath: string): Partial<PageDoc> {
  const ast = parseTsx(filePath)
  const hero: Hero = { _type: 'hero', ctas: [] }
  const sections: PageDoc['sections'] = []

  traverse(ast as any, {
    JSXElement(path) {
      const op = path.node.openingElement
      if (!t.isJSXOpeningElement(op) || !t.isJSXIdentifier(op.name)) return
      const name = op.name.name

      // Hero-like components
      if (['Hero'].includes(name)) {
        const title = getAttrString(op, 'title')
        const subtitle = getAttrString(op, 'subtitle') || getAttrString(op, 'subhead')
        const eyebrow = getAttrString(op, 'eyebrow')
        if (title || subtitle || eyebrow) Object.assign(hero, { eyebrow, title, subtitle })
      }

      // CTA/CTAGroup
      if (['CTAGroup','CtaGroup','SecondaryCTA','SecondaryCta','secondaryCta'].includes(name)) {
        const heading = getAttrString(op, 'heading')
        const description = getAttrString(op, 'description')
        const align = (getAttrString(op, 'align') as any) || 'center'
        const text = collectJsxText(path.node)
        const labels = text.filter(Boolean)
        const ctas: Cta[] = []
        labels.forEach((label) => ctas.push({ label, href: '#' }))
        sections.push({ _type: 'cta', heading, description, align, ctas })
      }

      // Rich text blocks
      if (['Prose','Portable','RichText'].includes(name)) {
        const centered = getAttrBoolean(op, 'centered') ?? false
        const maxWidth = getAttrString(op, 'maxWidth') || 'prose'
        const text = collectJsxText(path.node)
        if (text.length) {
          sections.push({ _type: 'richText', centered, maxWidth, content: text.flatMap(PT) })
        }
      }

      // FAQ blocks
      if (['FAQ','FAQAccordion','Faq'].includes(name)) {
        sections.push({ _type: 'faqList', heading: 'FAQ', items: [] })
      }

      // Feature grids
      if (['FeatureGrid','Features','Highlights'].includes(name)) {
        const heading = getAttrString(op, 'heading')
        const subheading = getAttrString(op, 'subheading')
        sections.push({ _type: 'featureGrid', heading, subheading, items: [] })
      }

      // Anchors → CTA detection (best-effort)
      if (t.isJSXIdentifier(op.name, { name: 'a' })) {
        const href = getAttrString(op, 'href') || '#'
        const label = collectJsxText(path.node).join(' ').trim()
        if (label) {
          const last = sections[sections.length - 1]
          if (last && last._type === 'cta') (last as CtaSection).ctas.push({ label, href })
          else sections.push({ _type: 'cta', align: 'center', ctas: [{ label, href }] } as CtaSection)
        }
      }
    },
  })

  const out: Partial<PageDoc> = {}
  if (hero.title || hero.subtitle || hero.eyebrow || (hero.ctas && hero.ctas.length)) out.hero = hero
  out.sections = sections
  return out
}

// Map local file → slug
const targets: Array<{ file: string; slug: string }> = [
  { file: path.join('app','about','AboutPageClient.tsx'), slug: 'about' },
  { file: path.join('app','contact','ContactPageClient.tsx'), slug: 'contact' },
  { file: path.join('app','hotels','toronto-downtown','DowntownPageClient.tsx'), slug: 'hotels/toronto-downtown' },
  { file: path.join('app','HomePageClient.tsx'), slug: 'home' },
]

function main() {
  const result: PageDoc[] = []
  for (const t of targets) {
    if (!fs.existsSync(t.file)) continue
    const data = extractFromFile(t.file)
    result.push({ slug: t.slug, hero: data.hero as Hero, sections: (data.sections || []) as any[] })
  }
  console.log(JSON.stringify(result, null, 2))
}
main()


