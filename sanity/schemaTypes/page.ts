import seo from './seo'
import hero from './blocks/hero'
import richText from './blocks/richText'
import hotelCarousel from './blocks/hotelCarousel'
import poiGrid from './blocks/poiGrid'
import fragmentRef from './blocks/fragmentRef'
import secondaryCta from './blocks/secondaryCta'
import searchWidget from './blocks/searchWidget'
import faq from './blocks/faq'

export default {
  name: 'page',
  type: 'document',
  title: 'Page',
  fields: [
    { name: 'title', type: 'string', title: 'Title', validation: (r: any) => r.required() },
    { name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title' }, validation: (r: any) => r.required() },
    { name: 'hero', type: 'hero', title: 'Hero', hidden: ({ document }: any) => document?.slug?.current !== '' },
    { name: 'sections', type: 'array', title: 'Sections', of: [ { type: 'hero' }, { type: 'searchWidget' }, { type: 'richText' }, { type: 'hotelCarousel' }, { type: 'poiGrid' }, { type: 'secondaryCta' }, { type: 'faq' }, { type: 'fragmentRef' } ] },
    { name: 'seo', type: 'seo', title: 'SEO' },
    { name: 'excludeFromSitemap', type: 'boolean', title: 'Exclude from sitemap' }
  ]
} as const


