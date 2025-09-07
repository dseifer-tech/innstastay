import { type SchemaTypeDefinition } from 'sanity'
import hotel from './hotel'
import page from './page'
import location from './location'
import siteSettings from './siteSettings'
import navigation from './navigation'
import redirect from './redirect'
import fragment from './fragment'
import poi from './blocks/poi'
import seo from './seo'
import hero from './blocks/hero'
import richText from './blocks/richText'
import hotelCarousel from './blocks/hotelCarousel'
import poiGrid from './blocks/poiGrid'
import fragmentRef from './blocks/fragmentRef'
import secondaryCta from './blocks/secondaryCta'
import faq from './blocks/faq'
import searchWidget from './blocks/searchWidget'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // documents
    hotel,
    page,
    location,
    siteSettings,
    navigation,
    redirect,
    fragment,
    poi,
    // objects/blocks
    seo,
    hero,
    richText,
    hotelCarousel,
    poiGrid,
    fragmentRef,
    secondaryCta,
    faq,
    searchWidget,
  ],
}
