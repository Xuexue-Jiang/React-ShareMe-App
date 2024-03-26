import { defineType, defineField } from 'sanity'

export const artistType = ({
  name: 'artist',
  title: 'Artist',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
    })
  ]
})