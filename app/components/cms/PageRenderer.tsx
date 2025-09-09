import SectionRenderer from '@/app/components/SectionRenderer'

const SectionWrap = ({ className = '', children }: { className?: string; children: React.ReactNode }) => (
  <section className={`py-16 md:py-24 ${className}`}>
    <div className="container mx-auto px-4">{children}</div>
  </section>
)

export function PageRenderer({ hero, sections }: { hero?: any; sections?: any[] }) {
  const blocks = [hero, ...(sections || [])].filter(Boolean)
  if (!blocks.length) return null
  return (
    <>
      {blocks.map((block: any, i: number) => (
        <div key={block?._key ?? `${block?._type}-${i}`} data-cms-type={block?._type}>
          <SectionWrap className={block?._type === 'imageBanner' ? 'py-0' : ''}>
            <SectionRenderer sections={[block]} />
          </SectionWrap>
        </div>
      ))}
    </>
  )
}


