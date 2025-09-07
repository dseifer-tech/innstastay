export default {
  name: 'faq',
  type: 'object',
  title: 'FAQ',
  fields: [
    { name: 'title', type: 'string', title: 'Title', initialValue: 'Frequently Asked Questions' },
    {
      name: 'items',
      type: 'array',
      title: 'Questions',
      of: [{
        type: 'object',
        fields: [
          { name: 'question', type: 'string', title: 'Question', validation: (r: any) => r.required() },
          { name: 'answer', type: 'text', rows: 4, title: 'Answer', validation: (r: any) => r.required() }
        ]
      }]
    }
  ]
} as const


