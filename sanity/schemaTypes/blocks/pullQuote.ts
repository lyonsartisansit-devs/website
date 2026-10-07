import { defineType, defineField } from 'sanity'

export const pullQuote = defineType({
  name: 'pullQuote',
  title: 'Pull Quote',
  type: 'object',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 3,
      description:
        'Type WITHOUT quotation marks — the frontend will automatically render curly quotes (“ ”)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'supportingText',
      title: 'Supporting Text',
      type: 'text',
      rows: 2,
      description: 'Optional supporting text or attribution below the quote',
    }),
  ],
  preview: {
    select: {
      title: 'quote',
      subtitle: 'supportingText',
    },
    prepare({ title, subtitle }) {
      return {
        title: title ? `“${title}”` : 'Pull Quote',
        subtitle: subtitle || undefined,
      }
    },
  },
})
