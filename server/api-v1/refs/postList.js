export default {
  type: 'object',
  properties: {
    data: {
      type: 'array',
      description: 'Array of posts',
      items: {
        $ref: '#/components/schemas/PostWithTags',
      },
    },
    meta: {
      type: 'object',
      description: 'Meta data about list and collection',
      properties: {
        count: {
          description: 'Total number in collection',
          type: 'integer',
        },
        page: {
          description: 'Current page',
          type: 'integer',
        },
        pages: {
          description: 'Total number of pages',
          type: 'integer',
        },
      },
    },
  },
};
