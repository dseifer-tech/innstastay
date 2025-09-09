import Portable from '@/app/components/Portable'
import FAQ from '@/app/components/FAQ'
import { toHeroProps, toProseProps, toFeatureGridProps, toImageBannerProps, toCTAGroupProps, toFAQProps } from '@/app/components/cms/adapters'
import SectionRenderer from '@/app/components/SectionRenderer'

export function renderSection(section: any): JSX.Element | null {
  if (!section || typeof section !== 'object') return null
  switch (section._type) {
    case 'hero': {
      // Reuse existing SectionRenderer hero implementation by normalizing props
      const block = { _type: 'hero', ...toHeroProps(section) }
      return <SectionRenderer sections={[block] as any} />
    }
    case 'richText':
    case 'textBlock': {
      const props = toProseProps(section)
      return (
        <div className={`prose max-w-none ${props.centered ? 'mx-auto text-center' : ''} ${props.maxWidth !== 'prose' ? props.maxWidth : ''}`}>
          <Portable value={props.content} />
        </div>
      )
    }
    case 'faq':
    case 'faqList': {
      return <FAQ />
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


