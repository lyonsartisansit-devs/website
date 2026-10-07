import { defineType, defineField } from 'sanity'

export const textSection = defineType({
  name: 'textSection',
  title: 'Text Section',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Section Label',
      type: 'string',
      description:
        'Optional label shown in left column (defaults to category title on the first section)',
    }),
    defineField({
      name: 'lead',
      title: 'Lead Statement',
      type: 'text',
      rows: 3,
      description: 'Large serif statement introducing the section',
    }),
    defineField({
      name: 'body',
      title: 'Body Text',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    title: 'URL',
                    type: 'url',
                    validation: (Rule) =>
                      Rule.uri({
                        allowRelative: true,
                        scheme: ['https', 'http', 'mailto', 'tel'],
                      }),
                  },
                ],
              },
            ],
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'lead',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Text Section',
        subtitle: subtitle || 'Content text section',
      }
    },
  },
})
