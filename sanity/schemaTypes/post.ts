import { defineType, defineField } from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) =>
        Rule.required().max(90).error('Title is required and must not exceed 90 characters'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: async (slug, context) => {
          const { document, getClient } = context
          const client = getClient({ apiVersion: '2024-10-01' })
          const id = document?._id?.replace(/^drafts\./, '')
          const language = (document?.language as string) || 'en'
          const params = {
            draft: `drafts.${id}`,
            published: id,
            slug,
            language,
          }
          const query = `!defined(*[_type == "post" && !(_id in [$draft, $published]) && slug.current == $slug && language == $language][0]._id)`
          return client.fetch(query, params)
        },
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      options: {
        filter: ({ document }) => {
          const language = (document?.language as string) || 'en'
          return {
            filter: 'language == $language',
            params: { language },
          }
        },
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      validation: (Rule) =>
        Rule.required().max(160).error('Excerpt is required and must not exceed 160 characters'),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          validation: (Rule) =>
            Rule.required().error('Alt text is required for accessibility and SEO'),
        }),
      ],
      validation: (Rule) => Rule.required().error('Cover image is required'),
    }),
    defineField({
      name: 'featured',
      title: 'Featured Post',
      type: 'boolean',
      initialValue: false,
      description: 'Display this post prominently at the top of the Journal grid',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
      description: 'Used for ordering only; not displayed publicly on the site',
    }),
    defineField({
      name: 'marqueeText',
      title: 'Marquee Text',
      type: 'string',
      validation: (Rule) =>
        Rule.max(80).error('Marquee text must not exceed 80 characters'),
      description: 'Optional moving ticker text on the post page (falls back to post title)',
    }),
    defineField({
      name: 'body',
      title: 'Body Content',
      type: 'array',
      of: [
        { type: 'textSection' },
        { type: 'imageGallery' },
        { type: 'pullQuote' },
      ],
      validation: (Rule) =>
        Rule.required().min(1).error('At least one content section is required in the body'),
    }),
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'seo',
    }),
  ],
  orderings: [
    {
      title: 'Published Date, Newest',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Published Date, Oldest',
      name: 'publishedAtAsc',
      by: [{ field: 'publishedAt', direction: 'asc' }],
    },
    {
      title: 'Title, A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      categoryTitle: 'category.title',
      media: 'coverImage',
      language: 'language',
    },
    prepare({ title, categoryTitle, media, language }) {
      const langBadge = language ? `[${language.toUpperCase()}] ` : ''
      return {
        title: `${langBadge}${title || 'Untitled Post'}`,
        subtitle: categoryTitle || 'Uncategorized',
        media: media,
      }
    },
  },
})
