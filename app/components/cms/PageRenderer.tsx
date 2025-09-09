import { renderSection } from '@/app/components/cms/registry'

export function PageRenderer({ hero, sections }: { hero?: any; sections?: any[] }) {
  const blocks = [hero, ...(sections || [])].filter(Boolean)
  if (!blocks.length) return null
  return (
    <div className="space-y-16 md:space-y-24">
      {blocks.map((block: any, i: number) => (
        <section key={block?._key ?? i} data-cms-type={block?._type} className="max-w-7xl mx-auto px-4 sm:px-6">
          {renderSection(block)}
        </section>
      ))}
    </div>
  )
}


