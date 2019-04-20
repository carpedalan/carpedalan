import { commonErrors } from '../../refs/error';

const status = 200;

export default function(tags) {
  const get = async (req, res) => {
    const tagsWithCount = await tags.getTags();
    res.status(status).json(tagsWithCount);
  };

  get.apiDoc = {
    description: 'Get Tags',
    operationId: 'getTags',
    tags: ['tags', 'read'],
    parameters: [],
    responses: {
      ...commonErrors,
      [status]: {
        description: 'Tags were successfully fetched.',
        content: {
          'application/json': {
            schema: {
              description: 'An array of tag objects',
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name of tag',
                  },
                  id: {
                    type: 'string',
                    format: 'uuid',
                    description: 'uuid of tag',
                  },
                  count: {
                    type: 'integer',
                    description: 'Number of associations currently with tag',
                  },
                },
              },
            },
          },
        },
      },
    },
    security: [{ sessionAuthentication: ['write', 'read'] }],
  };
  return get;
}
