import {defineField, defineType} from 'sanity'

export const broker = defineType({
  name: 'broker',
  title: 'Broker',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Full name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'e.g. "Rosemarie A. Ramos, headshot"',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'prcLicense',
      title: 'PRC license',
      type: 'string',
      description: 'e.g. "PRC No. 0034576"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'areas',
      title: 'Areas of expertise',
      type: 'string',
      description: 'e.g. "South Luzon"',
    }),
    defineField({
      name: 'languages',
      title: 'Languages',
      type: 'string',
      description: 'e.g. "English, Filipino"',
    }),
    defineField({
      name: 'bio',
      title: 'One-line bio',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'isSample',
      title: 'Sample / placeholder entry',
      type: 'boolean',
      description:
        'Leave off for real brokers. Only turn on for a stand-in entry that must show the "placeholder, pending intake" warning on the site.',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'prcLicense',
    },
  },
})
