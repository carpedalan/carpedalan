// Showing that you don't need to have apiDoc defined on methodHandlers.
export default function(posts) {
  const post = async function(req, res, next) {
    const { body } = req;
    try {
      const response = await posts.create(body);
      res.status(201).json(response);
    } catch (e) {
      next(e);
    }
  };

  post.apiDoc = {
    description: 'Create Post',
    operationId: 'createPost',
    tags: ['posts'],
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
      201: {
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
