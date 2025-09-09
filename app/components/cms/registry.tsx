import Portable from '@/app/components/Portable'
import FAQ from '@/app/components/FAQ'
import { toProseProps } from '@/app/components/cms/adapters'
import SectionRenderer from '@/app/components/SectionRenderer'

export function renderSection(section: any): JSX.Element | null {
  if (!section || typeof section !== 'object') return null
  switch (section._type) {
    case 'hero': {
      // Map CMS hero → SectionRenderer hero shape
      const imageUrl = section?.image?.asset?.url || section?.image?.url || section?.image?.src
      const block = {
        _type: 'hero',
        headline: section?.title || section?.headline || '',
        subhead: section?.subtitle || section?.subhead || '',
        image: imageUrl ? { asset: { url: imageUrl } } : undefined,
        cta: (section?.ctas && section.ctas[0])
          ? { href: section.ctas[0]?.href || '#', label: section.ctas[0]?.label || 'Learn more' }
          : (section?.cta?.href ? { href: section.cta.href, label: section?.cta?.label || 'Learn more' } : undefined),
      }
      return <SectionRenderer sections={[block] as any} />
    }
    case 'richText':
    case 'textBlock': {
      const body = section?.content || section?.body || []
      const block = { _type: 'richText', body }
      return <SectionRenderer sections={[block] as any} />
    }
    case 'faq':
    case 'faqList': {
      const items = Array.isArray(section?.items) ? section.items.map((it: any) => ({ question: it?.question, answer: it?.answer })) : []
      const block = { _type: 'faq', title: section?.heading, items }
      return <SectionRenderer sections={[block] as any} />
    }
    case 'cta': {
      // Map to secondaryCta used by SectionRenderer
      const primary = Array.isArray(section?.ctas) ? section.ctas[0] : null
      const block = {
        _type: 'secondaryCta',
        title: section?.heading || '',
        subtitle: section?.description || '',
        buttonLabel: primary?.label || 'Learn more',
        href: primary?.href || '#',
      }
      return <SectionRenderer sections={[block] as any} />
    }
    default: {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[CMS] Unknown section type:', section?._type)
      }
      if (section?.body) {
        return (
          <div className="prose max-w-none">
            <Portable value={section.body} />
          </div>
        )
      }
      return null
    }
  }
}


