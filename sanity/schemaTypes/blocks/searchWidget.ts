export default {
  name: 'searchWidget',
  type: 'object',
  title: 'Search Widget',
  fields: [
    { name: 'title', type: 'string', title: 'Title', description: 'Optional heading above the search widget' },
    { name: 'subhead', type: 'text', title: 'Subhead', rows: 2 },
  ],
  preview: { select: { title: 'title' }, prepare: ({ title }: any) => ({ title: title || 'Search Widget' }) },
} as const


