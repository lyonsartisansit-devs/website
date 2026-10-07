import { defineType, defineField } from 'sanity'

export const journalPage = defineType({
  name: 'journalPage',
  title: 'Journal Page',
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
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      initialValue: 'Journal',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'text',
      rows: 2,
      initialValue: 'Stories, heritage, and events.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'seo',
    }),
  ],
  preview: {
    select: {
      eyebrow: 'eyebrow',
      heading: 'heading',
      language: 'language',
    },
    prepare({ eyebrow, heading, language }) {
      const langBadge = language ? `[${language.toUpperCase()}] ` : ''
      return {
        title: `${langBadge}Journal Page Settings`,
        subtitle: `${eyebrow} — ${heading}`,
      }
    },
  },
})
