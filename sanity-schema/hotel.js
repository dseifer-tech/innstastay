export default {
  name: 'hotel',
  title: 'Hotel',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Hotel Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'token',
      title: 'Google Hotels Token',
      type: 'string',
      description: 'Unique Google Hotels property token for API calls',
      validation: Rule => Rule.required()
    },
    {
      name: 'city',
      title: 'City',
      type: 'string',
      initialValue: 'Toronto',
      validation: Rule => Rule.required()
    },
    {
      name: 'area',
      title: 'Area/Neighborhood',
      type: 'string',
      description: 'Specific area like Downtown, Yorkville, etc.'
    },
    {
      name: 'address',
      title: 'Full Address',
      type: 'text',
      validation: Rule => Rule.required()
    },
    {
      name: 'phone',
      title: 'Phone Number',
      type: 'string'
    },
    {
      name: 'rating',
      title: 'Hotel Rating',
      type: 'number',
      validation: Rule => Rule.min(0).max(5).precision(1)
    },
    {
      name: 'hotelClass',
      title: 'Hotel Class (Stars)',
      type: 'number',
      validation: Rule => Rule.min(1).max(5).integer()
    },
    {
      name: 'description',
      title: 'Hotel Description',
      type: 'text',
      rows: 4,
      validation: Rule => Rule.required()
    },
    {
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Custom title for search engines'
    },
    {
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
      description: 'Custom description for search engines'
    },
    {
      name: 'gpsCoordinates',
      title: 'GPS Coordinates',
      type: 'object',
      fields: [
        {name: 'lat', type: 'number', title: 'Latitude'},
        {name: 'lng', type: 'number', title: 'Longitude'}
      ]
    },
    {
      name: 'images',
      title: 'Hotel Images',
      type: 'array',
      of: [{type: 'image'}],
      options: {
        layout: 'grid'
      }
    },
    {
      name: 'primaryImage',
      title: 'Primary Image',
      type: 'image',
      description: 'Main hotel image'
    },
    {
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Image for social media sharing'
    },
    {
      name: 'tags',
      title: 'Hotel Tags',
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
    },
    {
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
    },
    {
      name: 'bookingLinks',
      title: 'Booking Links',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {name: 'name', type: 'string', title: 'Link Name'},
          {name: 'urlTemplate', type: 'url', title: 'URL Template'},
          {name: 'isActive', type: 'boolean', title: 'Active', initialValue: true}
        ]
      }]
    },
    {
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Is this hotel active and visible on the site?',
      initialValue: true
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'city',
      media: 'primaryImage'
    }
  }
}
