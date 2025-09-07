import { client } from '@/lib/cms/sanityClient'

export async function expandFragmentRefs(sections: any[], seen: Set<string> = new Set()): Promise<any[]> {
  if (!Array.isArray(sections) || sections.length === 0) return []
  const out: any[] = []
  for (const s of sections) {
    if (s?._type === 'fragmentRef') {
      const id = s.refId || s.ref?._ref
      if (!id || seen.has(id)) continue
      seen.add(id)
      const frag = await client.fetch(`*[_type=="fragment" && _id==$id][0]{ sections }`, { id })
      if (frag?.sections) {
        const nested = await expandFragmentRefs(frag.sections, seen)
        out.push(...nested)
      }
      continue
    }
    out.push(s)
  }
  return out
}


