import { adminPassword, publicPassword } from '../../config';
import { READ_USER, WRITE_USER } from '../../constants';
import { UnauthenticatedError } from '../../errors';
import { setSignedCloudfrontCookie } from '../../middlewares';
import { commonErrors } from '../refs/error';

const status = 200;

const login = () => {
  const post = (req, res, next) => {
    if (req.body.password === publicPassword) {
      req.session.user = READ_USER;
      req.session.requests = 1;
      setSignedCloudfrontCookie(res);
      res.status(status).send({ user: req.session.user });
    } else if (req.body.password === adminPassword) {
      req.session.user = WRITE_USER;
      req.session.requests = 1;
      setSignedCloudfrontCookie(res);
      res.status(status).send({ user: req.session.user });
    } else {
      next(new UnauthenticatedError("Username/password didn't match"));
    }
  };
  post.apiDoc = {
    description: 'Log user in',
    operationId: 'login',
    tags: ['_user'],
    requestBody: {
      description: 'Request body for login',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            description: 'Object with password property',
            required: ['password'],
            properties: {
              password: {
                description: 'password',
                type: 'string',
                format: 'password',
              },
            },
          },
        },
      },
    },
    responses: {
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
                  enum: [READ_USER, WRITE_USER],
                },
              },
            },
          },
        },
      },
      ...commonErrors,
      401: {
        description: 'User sent a bad password',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
    },
    security: [],
  };
  return { post };
};

export default login;
