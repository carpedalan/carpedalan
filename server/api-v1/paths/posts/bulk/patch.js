import { commonErrors } from '../../../refs/error';

const responseCode = 201;

export default function(posts) {
  const bulkPatch = async function(req, res, next) {
    const { ids, tags, description } = req.body;
    try {
      const response = await posts.bulkPatch({ ids, tags, description });
      res.status(responseCode).json(response);
    } catch (e) {
      next(e);
    }
  };

  bulkPatch.apiDoc = {
    description: 'Get Posts',
    operationId: 'postPosts',
    tags: ['posts', 'bulk', 'write'],
    requestBody: {
      description: 'Request body for posts',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            description: 'Object containing bulk patch request',
            required: ['ids'],
            properties: {
              ids: {
                type: 'array',
                description: 'Array of post ids affected by request',
                items: {
                  type: 'string',
                  format: 'uuid',
                  description: 'uuid of post',
                },
              },
              tags: {
                type: 'array',
                description: 'array of ids to ADD to all post ids',
                items: {
                  type: 'string',
                  format: 'uuid',
                  description: 'uuid of tag',
                },
              },
              description: {
                description: 'Descrtiption to update for all post ids',
                type: 'string',
              },
            },
          },
        },
      },
    },
    responses: {
      ...commonErrors,
      [responseCode]: {
        description: 'Posts were successfully updated',
      },
    },
    security: [{ sessionAuthentication: ['write'] }],
  };

  return bulkPatch;
}
