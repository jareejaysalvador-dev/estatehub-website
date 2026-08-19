import {defineField, defineType} from 'sanity'

export const development = defineType({
  name: 'development',
  title: 'Development',
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
        'Click "Generate" - do not type this by hand. It becomes the page URL, so it must be lowercase words separated by hyphens (e.g. "the-proscenium"), never plain text with spaces or capitals.',
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
      name: 'location',
      title: 'Location',
      type: 'string',
      description:
        'Shown on the project and used to group listings in the Location filter on the site. Enter it the same way every time - e.g. always "Makati City", never sometimes "Makati" or "Makati City" for the same place.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'developer',
      title: 'Developer',
      type: 'string',
      description: 'e.g. "Rockwell Land" - shown on cards and the project page.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'priceFrom',
      title: 'Price from (PHP)',
      type: 'number',
      description: 'The lowest current unit price. Shown on the card as "From ₱X".',
      validation: (rule) => rule.required().positive(),
    }),
    defineField({
      name: 'priceTo',
      title: 'Price to (PHP)',
      type: 'number',
      description:
        'Optional - the highest current unit price, if you want to show a range instead of just "From".',
      validation: (rule) =>
        rule
          .positive()
          .min(rule.valueOfField('priceFrom'))
          .error('Must be at least the "Price from" amount.'),
    }),
    defineField({
      name: 'turnoverDate',
      title: 'Turnover',
      type: 'string',
      description: 'Optional - e.g. "Turnover 2028", "Q4 2027", "RFO". Free text, shown as-is.',
    }),
    defineField({
      name: 'blurb',
      title: 'About this development',
      type: 'text',
      rows: 3,
      description:
        'Optional - the site hides this section entirely on a project until it has real copy, rather than showing it empty.',
    }),
    defineField({
      name: 'neighborhood',
      title: 'About the neighborhood',
      type: 'text',
      rows: 3,
      description:
        'Optional - the site hides this section entirely on a project until it has real copy, rather than showing it empty.',
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
              description:
                'Optional, but real screen-reader users get nothing from this photo without it. Describe what is actually in it if you can.',
            }),
          ],
        },
      ],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'brochure',
      title: 'Brochure / sales kit (PDF)',
      type: 'file',
      options: {accept: '.pdf'},
      description: 'Optional - shown as a download button on the project page when present.',
    }),
    defineField({
      name: 'unitTypes',
      title: 'Unit types',
      type: 'array',
      description:
        'One entry per floor plan / unit model. Only the name is required - leave the rest blank until the price sheet confirms it. Drag to control display order.',
      of: [
        {
          type: 'object',
          name: 'unitType',
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              description: 'e.g. "Townhouse Suite A", "Tower 1 - 2BR Corner"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'category',
              title: 'Category',
              type: 'string',
              description:
                'Optional - lets this project appear under the matching Property type filter on the site.',
              options: {
                list: ['House', 'Condo', 'Townhouse', 'Lot', 'Commercial'],
              },
            }),
            defineField({
              name: 'price',
              title: 'Price (PHP)',
              type: 'number',
              validation: (rule) => rule.positive(),
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
              name: 'floorPlan',
              title: 'Floor plan',
              type: 'file',
              options: {accept: '.pdf,.png,.jpg,.jpeg,.webp'},
              description: 'Optional - PDF or image, whatever the sales kit provides.',
            }),
          ],
          preview: {
            select: {
              title: 'name',
              category: 'category',
              price: 'price',
            },
            prepare({title, category, price}: {title?: string; category?: string; price?: number}) {
              const parts = [category, price ? `₱${price.toLocaleString('en-PH')}` : null].filter(
                Boolean,
              )
              return {
                title: title || 'Untitled unit type',
                subtitle: parts.join(' · '),
              }
            },
          },
        },
      ],
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
