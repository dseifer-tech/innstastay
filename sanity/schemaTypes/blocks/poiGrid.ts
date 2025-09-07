export default {
  name: 'poiGrid',
  type: 'object',
  title: 'POI Grid',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'pois', type: 'array', of: [{ type: 'reference', to: [{ type: 'poi' }] }] }
  ]
} as const


