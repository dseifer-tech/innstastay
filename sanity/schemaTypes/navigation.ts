export default {
  name: 'navigation',
  type: 'document',
  title: 'Navigation',
  __experimental_actions: ['update', 'publish'],
  fields: [
    {
      name: 'mainMenu',
      type: 'array',
      title: 'Main Menu',
      of: [{
        type: 'object',
        title: 'Menu Item',
        fields: [
          { name: 'label', type: 'string', validation: (r: any) => r.required() },
          { name: 'href', type: 'string' },
          { name: 'ref', type: 'reference', to: [{ type: 'page' }, { type: 'location' }, { type: 'hotel' }] },
          { name: 'external', type: 'boolean' }
        ]
      }]
    },
    {
      name: 'footerMenu',
      type: 'array',
      title: 'Footer Menu',
      of: [{
        type: 'object',
        title: 'Menu Item',
        fields: [
          { name: 'label', type: 'string', validation: (r: any) => r.required() },
          { name: 'href', type: 'string' },
          { name: 'ref', type: 'reference', to: [{ type: 'page' }, { type: 'location' }, { type: 'hotel' }] },
          { name: 'external', type: 'boolean' }
        ]
      }]
    }
  ]
} as const


