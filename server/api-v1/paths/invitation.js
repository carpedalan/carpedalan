const status = 200;

const invitation = () => {
  const post = (req, res) => {
    res.status(200).send({ refreshed: true });
  };

  post.apiDoc = {
    description: 'User requested an invite',
    operationId: 'request',
    tags: ['_user'],
    requestBody: {
      description: 'Request body for invitation',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            description: 'Payload for invitation',
            required: ['name', 'email'],
            properties: {
              name: {
                description: 'Name',
                type: 'string',
                example: 'Jay Inslee',
              },
              email: {
                description: 'E-mail',
                type: 'string',
                format: 'email',
              },
            },
          },
        },
      },
    },
    responses: {
      [status]: {
        description: 'User successfully requested invitation',
      },
    },
    security: [],
  };
  return { post };
};

export default invitation;
