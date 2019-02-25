import { commonErrors } from '../../refs/error';

const status = 201;

export default function(tags) {
  const post = async (req, res, next) => {
    try {
      const tagsWithCount = await tags.createTag(req.body.tag);
      res.status(status).json(tagsWithCount);
    } catch (e) {
      next(e);
    }
  };

  post.apiDoc = {
    description: 'Create tag',
    operationId: 'postTags',
    tags: ['tags', 'write'],
    requestBody: {
      description: 'Request body for tag',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Name of the new tag',
                example: 'some tag',
              },
            },
            required: ['name'],
            additionalProperties: false,
          },
        },
      },
    },
    responses: {
      ...commonErrors,
      [status]: {
        description: 'Tags were successfully created.',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schema/Tag',
            },
          },
        },
      },
    },
    security: [{ sessionAuthentication: ['write'] }],
  };
  return post;
}
