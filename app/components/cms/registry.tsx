import Image from 'next/image'
import Portable from '@/app/components/Portable'
import FAQ from '@/app/components/FAQ'

export function renderSection(section: any): JSX.Element | null {
  if (!section || typeof section !== 'object') return null
  switch (section._type) {
    case 'hero': {
      const headline = section.headline || ''
      const subhead = section.subhead || ''
      const imageUrl = section?.image?.asset?.url
      const hasImage = !!imageUrl
      const textColor = hasImage ? 'text-white' : 'text-gray-900'
      const subColor = hasImage ? 'text-white/90' : 'text-gray-600'
      return (
        <div className={`relative overflow-hidden ${hasImage ? '' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
          <div className={hasImage ? 'relative h-[56vh] md:h-[68vh]' : 'py-20'}>
            {hasImage && (
              <div className="absolute inset-0">
                <Image src={imageUrl!} alt={section?.image?.alt || ''} fill priority className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-transparent" />
              </div>
            )}
            <div className={`relative z-10 max-w-7xl mx-auto ${hasImage ? 'h-full' : ''} px-4 sm:px-6 flex items-center`}>
              <div className={`max-w-3xl ${textColor}`}>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">{headline}</h1>
                {subhead && <p className={`mt-4 text-lg md:text-xl ${subColor}`}>{subhead}</p>}
                {section?.cta?.href && (
                  <a className="inline-block mt-6 rounded-xl px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg" href={section.cta.href}>
                    {section?.cta?.label || 'Learn more'}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )
    }
    case 'richText':
    case 'textBlock': {
      return (
        <div className="prose max-w-none">
          <Portable value={section.body || section.content} />
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


