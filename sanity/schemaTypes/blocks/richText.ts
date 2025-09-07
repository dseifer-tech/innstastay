export default {
  name: 'richText',
  type: 'object',
  title: 'Rich Text',
  fields: [
    { name: 'body', type: 'array', of: [{ type: 'block' }] }
  ]
} as const


