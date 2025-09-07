export default {
  name: 'poi',
  type: 'document',
  title: 'Point of Interest',
  fields: [
    { name: 'name', type: 'string', validation: (R: any) => R.required() },
    { name: 'slug', type: 'slug', options: { source: 'name' }, validation: (R: any) => R.required() },
    { name: 'shortDescription', type: 'text', title: 'Description' },
    { name: 'url', type: 'url', title: 'External Link' },
    { name: 'image', type: 'image', options: { hotspot: true }, title: 'Image' },
    { name: 'imageUrl', type: 'url', title: 'External Image URL' },
    { name: 'rating', type: 'number', title: 'Rating (0-5)' },
    { name: 'reviews', type: 'number', title: 'Reviews Count' },
  ]
} as const


