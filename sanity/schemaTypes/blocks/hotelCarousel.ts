export default {
  name: 'hotelCarousel',
  type: 'object',
  title: 'Hotel Carousel',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'hotels', type: 'array', of: [{ type: 'reference', to: [{ type: 'hotel' }] }] }
  ]
} as const


