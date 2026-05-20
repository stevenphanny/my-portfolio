import { defineField, defineType } from 'sanity'

export const timelineEventSchema = defineType({
  name: 'timelineEvent',
  title: 'Timeline Event',
  type: 'document',
  fields: [
    defineField({
      name: 'eventKey',
      title: 'Event key',
      type: 'string',
      description: 'Must match the eventKey in timelineData.tsx — e.g. "mcav", "cats", "marathon"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'panelImages',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'panelLayout',
      title: 'Image layout',
      type: 'string',
      options: {
        list: [
          { title: 'Hero (single large image)', value: 'hero' },
          { title: 'Grid (2-column mosaic)', value: 'grid' },
          { title: 'Strip (horizontal scroll)', value: 'strip' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'panelSize',
      title: 'Panel size',
      type: 'string',
      options: {
        list: [
          { title: 'Small', value: 'small' },
          { title: 'Medium (default)', value: 'medium' },
          { title: 'Large', value: 'large' },
        ],
        layout: 'radio',
      },
      initialValue: 'medium',
    }),
  ],
  preview: {
    select: { title: 'eventKey', media: 'panelImages.0' },
    prepare({ title, media }) {
      return { title: title || '(no key)', media }
    },
  },
})
