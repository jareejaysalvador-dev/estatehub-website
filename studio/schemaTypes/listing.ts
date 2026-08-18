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
      description:
        'Click "Generate" - do not type this by hand. It becomes the page URL, so it must be lowercase words separated by hyphens (e.g. "cypress-single-detached-unit-4a"), never plain text with spaces or capitals.',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input: string) =>
          input
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 96),
      },
      validation: (rule) =>
        rule.required().custom((value) => {
          if (!value?.current) return 'Required.'
          return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value.current)
            ? true
            : 'Must be lowercase letters, numbers, and hyphens only, with no spaces - click "Generate" instead of typing it directly.'
        }),
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
      description:
        'Shown on the listing and used to group listings in the Location filter on the site. Enter it the same way every time - e.g. always "Tagaytay, Cavite", never sometimes "Tagaytay" or "Tagaytay City" for the same place.',
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
      description: 'Optional - the site hides this section entirely on a listing until it has real copy, rather than showing it empty.',
    }),
    defineField({
      name: 'neighborhood',
      title: 'About the neighborhood',
      type: 'text',
      rows: 3,
      description: 'Optional - the site hides this section entirely on a listing until it has real copy, rather than showing it empty.',
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
