import { commonErrors } from '../../refs/error';

const status = 201;

// Showing that you don't need to have apiDoc defined on methodHandlers.
export default function(posts) {
  const post = async function(req, res, next) {
    const { body } = req;
    try {
      const response = await posts.create(body);
      res.status(status).json(response);
    } catch (e) {
      next(e);
    }
  };

  post.apiDoc = {
    description: 'Create Post',
    operationId: 'createPost',
    tags: ['posts', 'write'],
    requestBody: {
      description: 'Request body for posts',
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Post',
          },
        },
      },
    },
    responses: {
      ...commonErrors,
      [status]: {
        description: 'Post was successfully created',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Post',
            },
          },
        },
      },
    },
    security: [{ sessionAuthentication: ['write'] }],
  };

  return post;
}
