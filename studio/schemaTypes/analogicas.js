export default {
  name: 'analogPhoto',
  title: 'Fotos Análogas',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Título de la foto',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'image',
      title: 'Archivo de Imagen',
      type: 'image',
      options: {
        hotspot: true
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'category',
      title: 'Categoría',
      type: 'string',
      options: {
        list: [
          { title: 'Blanco y Negro', value: 'bw' },
          { title: 'Color', value: 'color' },
          { title: 'Negativos Encontrados', value: 'negative' }
        ],
        layout: 'radio'
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'order',
      title: 'Número de Orden (Ej: 1, 2, 3...)',
      type: 'number',
      initialValue: 0
    }
  ],
  orderings: [
    {
      title: 'Por Orden Ascendente',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }]
    }
  ]
}