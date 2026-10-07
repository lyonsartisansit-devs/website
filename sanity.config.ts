'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { documentInternationalization } from '@sanity/document-internationalization'
import { schemaTypes } from './sanity/schemaTypes'
import { structure } from './sanity/structure'
import { projectId, dataset } from './sanity/lib/env'
import { supportedLanguages } from './i18n/routing'

export default defineConfig({
  basePath: '/studio',
  name: 'lyons-artisans-journal-studio',
  title: "Lyon's Artisans — Studio",

  projectId,
  dataset,

  plugins: [
    structureTool({
      structure,
    }),
    documentInternationalization({
      supportedLanguages: supportedLanguages as any,
      schemaTypes: ['post', 'category', 'journalPage'],
    }),
    visionTool({
      defaultApiVersion: '2024-10-01',
    }),
  ],

  schema: {
    types: schemaTypes,
    // Filter out translation.metadata from the global "Create new document" menu
    templates: (templates) =>
      templates.filter(
        ({ schemaType }) => !['translation.metadata'].includes(schemaType)
      ),
  },
})
