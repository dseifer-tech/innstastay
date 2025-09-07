export default {
  name: 'fragmentRef',
  type: 'object',
  title: 'Fragment Reference',
  fields: [
    { name: 'ref', type: 'reference', to: [{ type: 'fragment' }], validation: (R: any) => R.required() }
  ],
  preview: { select: { title: 'ref.title' } }
} as const


