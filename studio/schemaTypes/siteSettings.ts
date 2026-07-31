import {defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'contactEmail',
      title: 'Contact email',
      type: 'string',
      description: 'Shown as a tap-to-email link on the site',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'contactPhone',
      title: 'Contact phone',
      type: 'string',
      description: 'e.g. "+63 991 797 4412" - shown as a tap-to-call link on the site',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'facebookPageId',
      title: 'Facebook Page ID',
      type: 'string',
      description:
        'From your Facebook Page URL or Page settings. Leave empty and the Messenger button simply won\'t show on the site yet.',
    }),
  ],
})
