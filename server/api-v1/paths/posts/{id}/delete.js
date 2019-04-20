import { commonErrors } from '../../../refs/error';

const status = 204;

export default function(posts) {
  const patch = async function(req, res, next) {
    const { id } = req.params;
    try {
      await posts.delete(id);
      res.status(status).end();
    } catch (e) {
      next(e);
    }
  };

  patch.apiDoc = {
    description: 'Delete Post',
    operationId: 'delPost',
    tags: ['posts', 'write'],
    parameters: [
      {
        in: 'path',
        name: 'id',
        schema: {
          type: 'string',
          format: 'uuid',
          description: 'uuid of post',
        },
        required: true,
      },
    ],
    responses: {
      ...commonErrors,
      [status]: {
        description: 'Post was successfully deleted.',
      },
    },
    security: [{ sessionAuthentication: ['write'] }],
  };

  return patch;
}
