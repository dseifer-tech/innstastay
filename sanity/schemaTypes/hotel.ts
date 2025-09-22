import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'hotel',
  title: 'Hotel',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Hotel Name',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'token',
      title: 'Google Hotels Token',
      type: 'string',
      description: 'Token used for live pricing from Google Hotels API'
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string'
    }),
    defineField({
      name: 'area',
      title: 'Area/Neighborhood',
      type: 'string'
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'text'
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string'
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(5)
    }),
    defineField({
      name: 'hotelClass',
      title: 'Hotel Class (Stars)',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(5)
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text'
    }),
    defineField({
      name: 'gpsCoordinates',
      title: 'GPS Coordinates',
      type: 'object',
      fields: [
        {name: 'lat', type: 'number', title: 'Latitude'},
        {name: 'lng', type: 'number', title: 'Longitude'}
      ]
    }),
    defineField({
      name: 'primaryImage',
      title: 'Primary Image',
      type: 'image',
      options: {
        hotspot: true,
      }
    }),
    defineField({
      name: 'primaryImageUrl',
      title: 'Primary Image URL (External)',
      type: 'url',
      description: 'External image URL (will be used if primaryImage is not set)'
    }),
    defineField({
      name: 'images',
      title: 'Gallery Images',
      type: 'array',
      of: [{type: 'image'}],
      options: {
        layout: 'grid'
      }
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Custom title for SEO (optional)'
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      description: 'Custom description for SEO (optional)'
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Extended Stay', value: 'extended_stay'},
          {title: 'Boutique', value: 'boutique'},
          {title: 'Family Friendly', value: 'family_friendly'},
          {title: 'Luxury', value: 'luxury'},
          {title: 'Business', value: 'business'},
          {title: 'Entertainment District', value: 'entertainment_district'},
          {title: 'Financial District', value: 'financial_district'},
          {title: 'Yorkville', value: 'yorkville'},
          {title: 'Downtown', value: 'downtown'}
        ]
      }
    }),
    defineField({
      name: 'amenities',
      title: 'Amenities',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Free WiFi', value: 'Free WiFi'},
          {title: 'Restaurant', value: 'Restaurant'},
          {title: 'Fitness Center', value: 'Fitness Center'},
          {title: 'Pool', value: 'Pool'},
          {title: 'Spa', value: 'Spa'},
          {title: 'Business Center', value: 'Business Center'},
          {title: 'Kitchen', value: 'Kitchen'},
          {title: 'Free Breakfast', value: 'Free Breakfast'},
          {title: 'Bar', value: 'Bar'},
          {title: 'Concierge', value: 'Concierge'},
          {title: 'Kids Club', value: 'Kids Club'},
          {title: 'Art Gallery', value: 'Art Gallery'},
          {title: 'Historic Building', value: 'Historic Building'},
          {title: 'Downtown Location', value: 'Downtown Location'},
          {title: 'Boutique Hotel', value: 'Boutique Hotel'}
        ]
      }
    }),
    defineField({
      name: 'bookingLinks',
      title: 'Booking Links (legacy)',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {name: 'name', type: 'string', title: 'Link Name'},
          {name: 'urlTemplate', type: 'url', title: 'URL Template'},
          {name: 'isActive', type: 'boolean', title: 'Active', initialValue: true}
        ]
      }]
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Is this hotel active and visible on the site?',
      initialValue: true
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'city',
      media: 'primaryImage'
    }
  }
})
