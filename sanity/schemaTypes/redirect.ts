export default {
  name: 'redirect',
  type: 'document',
  title: 'Redirect',
  fields: [
    { name: 'fromPath', type: 'string', title: 'From Path', validation: (r: any) => r.required() },
    { name: 'toPath', type: 'string', title: 'To Path', validation: (r: any) => r.required() },
    { name: 'status', type: 'number', title: 'Status (301 or 302)', validation: (r: any) => r.required().custom((v: number) => (v === 301 || v === 302) ? true : 'Must be 301 or 302') }
  ]
} as const


