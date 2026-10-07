import { type SchemaTypeDefinition } from 'sanity'
import { seo } from './objects/seo'
import { textSection } from './blocks/textSection'
import { imageGallery } from './blocks/imageGallery'
import { pullQuote } from './blocks/pullQuote'
import { category } from './category'
import { journalPage } from './journalPage'
import { post } from './post'

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents
  journalPage,
  post,
  category,

  // Blocks
  textSection,
  imageGallery,
  pullQuote,

  // Objects
  seo,
]
