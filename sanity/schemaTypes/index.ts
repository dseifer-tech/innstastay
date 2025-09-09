import { type SchemaTypeDefinition } from 'sanity'
import hotel from './hotel'
import location from './location'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    hotel,
    location,
  ],
}
