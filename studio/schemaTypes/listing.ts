import {defineField, defineType} from 'sanity'

export const listing = defineType({
  name: 'listing',
  title: 'Listing',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'For Sale', value: 'For Sale'},
          {title: 'For Lease', value: 'For Lease'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Property type',
      type: 'string',
      options: {
        list: ['House', 'Condo', 'Townhouse', 'Lot', 'Commercial'],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'e.g. "Tagaytay, Cavite"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (PHP)',
      type: 'number',
      description: 'Monthly amount for leases, total price for sales',
      validation: (rule) => rule.required().positive(),
    }),
    defineField({
      name: 'beds',
      title: 'Bedrooms',
      type: 'number',
      validation: (rule) => rule.integer().positive(),
    }),
    defineField({
      name: 'baths',
      title: 'Bathrooms',
      type: 'number',
      validation: (rule) => rule.integer().positive(),
    }),
    defineField({
      name: 'floorAreaSqm',
      title: 'Floor area (sqm)',
      type: 'number',
      validation: (rule) => rule.positive(),
    }),
    defineField({
      name: 'lotAreaSqm',
      title: 'Lot area (sqm)',
      type: 'number',
      validation: (rule) => rule.positive(),
    }),
    defineField({
      name: 'blurb',
      title: 'About this property',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'neighborhood',
      title: 'About the neighborhood',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'photos',
      title: 'Photos',
      type: 'array',
      description: 'First photo is the cover image shown on cards and in search results.',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              description: 'Describe what is actually in the photo - required for every image.',
              validation: (rule) => rule.required(),
            }),
          ],
        },
      ],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'broker',
      title: 'Assigned broker',
      type: 'reference',
      to: [{type: 'broker'}],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'location',
      media: 'photos.0',
    },
  },
})
