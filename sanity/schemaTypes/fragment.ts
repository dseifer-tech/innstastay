export default {
  name: 'fragment',
  type: 'document',
  title: 'Reusable Fragment',
  fields: [
    { name: 'title', type: 'string', validation: (R: any) => R.required() },
    {
      name: 'sections',
      type: 'array',
      of: [
        { type: 'hero' },
        { type: 'richText' },
        { type: 'hotelCarousel' },
        { type: 'poiGrid' },
        { type: 'secondaryCta' },
        { type: 'faq' }
      ]
    }
  ]
} as const


