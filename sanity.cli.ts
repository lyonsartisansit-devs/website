import { defineCliConfig } from 'sanity/cli'
import { projectId, dataset } from './sanity/lib/env'

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  typegen: {
    enabled: true,
    path: './{app,components,sanity,lib}/**/*.{ts,tsx,js,jsx}',
    schema: 'schema.json',
    generates: './sanity.types.ts',
    overloadClientMethods: true,
  },
})
