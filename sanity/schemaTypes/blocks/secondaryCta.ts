export default {
  name: 'secondaryCta',
  type: 'object',
  title: 'Secondary CTA',
  fields: [
    { name: 'title', type: 'string', title: 'Title', validation: (r: any) => r.required() },
    { name: 'subtitle', type: 'text', rows: 3, title: 'Subtitle' },
    { name: 'buttonLabel', type: 'string', title: 'Button Label', validation: (r: any) => r.required() },
    { name: 'href', type: 'string', title: 'Link Href', validation: (r: any) => r.required() },
  ]
} as const


