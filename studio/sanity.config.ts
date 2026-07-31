import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

// Singleton: exactly one Site Settings document should ever exist, at a
// fixed, known id, so the site can fetch it directly without a query.
const SINGLETON_TYPE = 'siteSettings'
const SINGLETON_ID = 'siteSettings'

export default defineConfig({
  name: 'default',
  title: 'EstateHub.ph',

  projectId: '0wtk03lk',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site Settings')
              .id(SINGLETON_ID)
              .child(S.document().schemaType(SINGLETON_TYPE).documentId(SINGLETON_ID)),
            S.divider(),
            ...S.documentTypeListItems().filter((item) => item.getId() !== SINGLETON_TYPE),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
