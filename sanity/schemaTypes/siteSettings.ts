import seo from './seo'

export default {
  name: 'siteSettings',
  type: 'document',
  title: 'Site Settings',
  __experimental_actions: ['update', 'publish'],
  fields: [
    { name: 'gtmId', type: 'string', title: 'GTM Container ID' },
    { name: 'gaId', type: 'string', title: 'GA4 Measurement ID' },
    { name: 'defaultSeo', type: 'seo', title: 'Default SEO' },
    {
      name: 'contact', title: 'Contact', type: 'object', fields: [
        { name: 'email', type: 'string' },
        { name: 'phone', type: 'string' },
        { name: 'address', type: 'string' }
      ]
    },
    {
      name: 'social', title: 'Social', type: 'object', fields: [
        { name: 'twitter', type: 'url' },
        { name: 'facebook', type: 'url' },
        { name: 'instagram', type: 'url' }
      ]
    },
    { name: 'logo', type: 'image', title: 'Logo', options: { hotspot: true } },
    { name: 'favicon', type: 'image', title: 'Favicon', options: { hotspot: true } }
  ]
} as const


