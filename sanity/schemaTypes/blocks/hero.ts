export default {
  name: 'hero',
  type: 'object',
  title: 'Hero',
  fields: [
    { name: 'headline', type: 'string', title: 'Headline', validation: (r: any) => r.required().max(90) },
    { name: 'subhead', type: 'text', title: 'Subhead' },
    { name: 'image', type: 'image', title: 'Image', options: { hotspot: true } },
    {
      name: 'cta',
      type: 'object',
      title: 'CTA',
      fields: [
        { name: 'label', type: 'string', title: 'Label' },
        { name: 'href', type: 'string', title: 'Href' },
        { name: 'external', type: 'boolean', title: 'Open in new tab?' }
      ]
    }
  ],
  preview: { select: { title: 'headline' } }
} as const


