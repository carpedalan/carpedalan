import { commonErrors } from '../refs/error';

const status = 200;

const logout = () => {
  const post = (req, res) => {
    req.session.destroy();
    res.status(status).send();
  };
  post.apiDoc = {
    description: 'Log user logout',
    operationId: 'logout',
    tags: ['_user'],
    responses: {
      ...commonErrors,
      [status]: {
        description: 'User successfully logged out',
      },
    },
    security: [],
  };
  return { post };
};

export default logout;
