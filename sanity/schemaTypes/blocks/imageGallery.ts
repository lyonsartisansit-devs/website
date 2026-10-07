import { defineType, defineField } from 'sanity'

export const imageGallery = defineType({
  name: 'imageGallery',
  title: 'Image Gallery',
  type: 'object',
  fields: [
    defineField({
      name: 'images',
      title: 'Gallery Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alternative Text',
              type: 'string',
              validation: (Rule) =>
                Rule.required().error('Alt text is required for accessibility and SEO'),
            }),
          ],
        },
      ],
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .max(4)
          .error('Image gallery must contain between 1 and 4 images'),
    }),
  ],
  preview: {
    select: {
      images: 'images',
    },
    prepare({ images }) {
      const count = images ? images.length : 0
      return {
        title: `Image Gallery (${count} image${count === 1 ? '' : 's'})`,
        media: images && images[0],
      }
    },
  },
})
