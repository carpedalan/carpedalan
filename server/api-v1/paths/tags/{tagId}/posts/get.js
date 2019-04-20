import { commonErrors } from '../../../../refs/error';

const status = 200;

export default function(posts) {
  const get = async (req, res) => {
    const { tagId } = req.params;
    const postsWithCount = await posts.getAll({ tag: tagId });
    res.status(status).json(postsWithCount);
  };

  get.apiDoc = {
    description: 'Get Posts associated with a tag',
    operationId: 'getPostsByTag',
    tags: ['tags', 'read'],
    parameters: [
      {
        in: 'path',
        name: 'tagId',
        schema: {
          type: 'string',
          format: 'uuid',
          example: '0f634edd-e401-4d6a-b5b2-9ae32dffa871',
          description: 'uuid of tag that all posts are associated with',
        },
        required: true,
      },
    ],

    responses: {
      ...commonErrors,
      [status]: {
        description: 'Tags were successfully fetched.',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/PostList',
            },
          },
        },
      },
    },
    security: [{ sessionAuthentication: ['write', 'read'] }],
  };
  return get;
}
