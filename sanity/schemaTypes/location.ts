import seo from './seo'

export default {
  name: 'location',
  type: 'document',
  title: 'Location',
  fields: [
    { name: 'title', type: 'string', title: 'Title', validation: (r: any) => r.required() },
    { name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title' }, validation: (r: any) => r.required() },
    { name: 'intro', type: 'text', title: 'Intro' },
    { name: 'images', type: 'array', of: [{ type: 'image', options: { hotspot: true } }], title: 'Images' },
    { name: 'hotelRefs', type: 'array', of: [{ type: 'reference', to: [{ type: 'hotel' }] }], title: 'Hotels' },
    { name: 'seo', type: 'seo', title: 'SEO' }
  ]
} as const


