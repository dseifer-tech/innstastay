import Image from 'next/image'
import type { CmsSection } from '@/lib/cms/page'
import Portable from '@/app/components/Portable'
import SecondaryCTA from '@/app/components/SecondaryCTA'
import CmsSearchWidget from '@/app/components/CmsSearchWidget'

function flatten(sections: any[] = []) {
  const out: any[] = []
  for (const s of sections) {
    if (s?._type === 'fragmentRef' && Array.isArray(s.sections)) out.push(...s.sections)
    else out.push(s)
  }
  return out
}

export default function SectionRenderer({ sections }: { sections: CmsSection[] | undefined }) {
  const list = flatten(sections as any[])
  if (!list?.length) return null
  return (
    <div className="space-y-10">
      {list.map((s: any, i: number) => {
        switch (s._type) {
          case 'hero':
            return (
              <section key={i} className="relative overflow-hidden">
                <div className="relative h-[56vh] md:h-[68vh]">
                  {s.image && (
                    <div className="absolute inset-0">
                      <Image src={(s.image.asset?.url) ?? '/placeholder.jpg'} alt="" fill priority className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-transparent" />
                    </div>
                  )}
                  <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center">
                    <div className="text-white max-w-3xl">
                      <h1 className="text-4xl md:text-5xl font-bold leading-tight">{s.headline}</h1>
                      {s.subhead && <p className="mt-4 text-lg md:text-xl text-white/90">{s.subhead}</p>}
                      {s.cta?.href && (
                        <a className="inline-block mt-6 rounded-xl px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg" href={s.cta.href}>
                          {s.cta.label || 'Learn more'}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            )
          case 'richText':
            return (
              <section key={i} className="prose max-w-none">
                <Portable value={s.body} />
              </section>
            )
          case 'searchWidget':
            return (
              <section key={i}>
                <CmsSearchWidget title={s.title} subhead={s.subhead} />
              </section>
            )
          case 'hotelCarousel':
            return (
              <section key={i}>
                {s.title && <h2 className="text-2xl font-semibold mb-4">{s.title}</h2>}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {s.hotels?.map((h: any) => (
                    <a key={h._id} href={`/hotels/${h.slug}`} className="rounded-2xl shadow p-3 block">
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3">
                        <Image src={(h.images?.[0]?.asset?.url) ?? '/placeholder.jpg'} alt={h.name} fill />
                      </div>
                      <div className="font-medium">{h.name}</div>
                    </a>
                  ))}
                </div>
              </section>
            )
          case 'poiGrid':
            return (
              <section key={i}>
                {s.title && <h2 className="text-2xl font-semibold mb-4">{s.title}</h2>}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {s.pois?.map((p: any) => (
                    <a key={p._id} href={p.url} className="rounded-2xl shadow p-3 block">
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3">
                        <Image src={(p.image?.asset?.url) ?? '/placeholder.jpg'} alt={p.name} fill />
                      </div>
                      <div className="font-medium">{p.name}</div>
                      {p.shortDescription && <p className="text-sm text-gray-600">{p.shortDescription}</p>}
                    </a>
                  ))}
                </div>
              </section>
            )
          case 'secondaryCta':
            return (
              <section key={i}>
                <SecondaryCTA
                  title={s.title}
                  subtitle={s.subtitle}
                  buttonText={s.buttonLabel}
                  href={s.href}
                />
              </section>
            )
          case 'faq':
            return (
              <section key={i} className="py-16 bg-gray-50">
                <div className="max-w-5xl mx-auto px-6">
                  {(s.title || 'Frequently Asked Questions') && (
                    <h2 className="text-3xl font-bold text-center mb-8">{s.title || 'Frequently Asked Questions'}</h2>
                  )}
                  <div className="space-y-3">
                    {Array.isArray(s.items) && s.items.map((item: any, idx: number) => (
                      <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                        <div className="font-semibold text-lg">{item.question}</div>
                        {item.answer && <p className="mt-2 text-gray-600">{item.answer}</p>}
                      </div>
                    ))}
                  </div>
                </div>
                {/* FAQ JSON-LD Schema */}
                {Array.isArray(s.items) && s.items.length > 0 && (
                  <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                      __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'FAQPage',
                        mainEntity: s.items.map((it: any) => ({
                          '@type': 'Question',
                          name: it.question,
                          acceptedAnswer: { '@type': 'Answer', text: it.answer }
                        }))
                      })
                    }}
                  />
                )}
              </section>
            )
          default:
            return null
        }
      })}
    </div>
  )
}


