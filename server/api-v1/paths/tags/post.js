import { commonErrors } from '../../refs/error';

const status = 201;

export default function(tags) {
  const post = async (req, res) => {
    const tagsWithCount = await tags.createTag(req.body.name);
    res.status(status).json(tagsWithCount);
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
        description: 'Tag was successfully created.',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Tag',
            },
          },
        },
      },
    },
    security: [{ sessionAuthentication: ['write'] }],
  };
  return post;
}
