import { commonErrors } from '../refs/error';

const status = 200;

const post = (req, res) => {
  Object.keys(req.body).forEach(key => {
    req.session[key] = req.body[key];
  });
  res.status(status).json({
    ...req.session,
    requests: parseInt(req.session.requests, 10),
  });
};

post.apiDoc = {
  description: 'Setting a property on the user session cookie token',
  operationId: 'setUser',
  tags: ['_user'],
  requestBody: {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            requests: {
              type: 'integer',
              minimum: 1,
              example: 1,
              description: 'How many times the user has requested a login',
            },
          },
        },
      },
    },
  },
  responses: {
    ...commonErrors,
    [status]: {
      description: 'User successfully logged in',
      content: {
        'application/json': {
          schema: {
            description: 'Result of logging in',
            type: 'object',
            properties: {
              user: {
                description: 'Role of user',
                type: 'string',
              },
              requests: {
                description: 'Number of requests',
                type: 'integer',
                minimum: 1,
                example: 1,
              },
            },
          },
        },
      },
    },
  },
  security: [{ sessionAuthentication: ['write', 'read'] }],
};

export default { post };
