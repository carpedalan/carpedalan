export default {
  type: 'object',
  description: 'Tag entity',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'uuid of tag record',
    },
    name: {
      type: 'string',
      description: 'Name of tag',
    },
  },
};
