export default {
  name: 'seo',
  type: 'object',
  title: 'SEO',
  fields: [
    { name: 'title', type: 'string', title: 'Title', validation: (r: any) => r.max(60) },
    { name: 'description', type: 'text', title: 'Description', validation: (r: any) => r.max(160) },
    { name: 'canonical', type: 'url', title: 'Canonical URL' },
    { name: 'ogImage', type: 'image', title: 'Open Graph Image', options: { hotspot: true } }
  ]
} as const


