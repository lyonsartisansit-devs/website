import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Journal Content')
    .items([
      // 1. Journal Page Documents (by Language)
      S.listItem()
        .title('Journal Page')
        .child(
          S.list()
            .title('Journal Page by Language')
            .items([
              S.listItem()
                .title('English (en)')
                .child(
                  S.document()
                    .schemaType('journalPage')
                    .documentId('journalPage-en')
                    .title('Journal Page (English)')
                ),
              S.listItem()
                .title('Spanish (es)')
                .child(
                  S.document()
                    .schemaType('journalPage')
                    .documentId('journalPage-es')
                    .title('Journal Page (Spanish)')
                ),
            ])
        ),

      S.divider(),

      // 2. Posts List (Default ordering publishedAt desc)
      S.listItem()
        .title('Posts')
        .schemaType('post')
        .child(
          S.documentTypeList('post')
            .title('All Posts')
            .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
        ),

      // 3. Categories List (Ordered by `order`)
      S.listItem()
        .title('Categories')
        .schemaType('category')
        .child(
          S.documentTypeList('category')
            .title('Categories')
            .defaultOrdering([{ field: 'order', direction: 'asc' }])
        ),

      // Exclude handled types and translation.metadata from remaining list items if any
      ...S.documentTypeListItems().filter(
        (listItem) =>
          !['journalPage', 'post', 'category', 'translation.metadata'].includes(
            listItem.getId() as string
          )
      ),
    ])
