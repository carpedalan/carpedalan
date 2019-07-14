import { commonErrors } from '../../../refs/error';

const status = 200;

export default function(posts) {
  const patch = async function(req, res, next) {
    const { body } = req;
    try {
      const response = await posts.update(body, req.params.id);
      res.status(status).json(response);
    } catch (e) {
      next(e);
    }
  };

  patch.apiDoc = {
    description: 'Patch Posts',
    operationId: 'patchPost',
    tags: ['posts', 'write'],
    parameters: [
      {
        in: 'path',
        name: 'id',
        schema: {
          type: 'string',
          format: 'uuid',
        },
        required: true,
        description: 'UUID of post to patch',
        example: 'f7bbd0d4-4508-11e9-b851-bf22de2ec42d',
      },
    ],
    requestBody: {
      description: 'Request body for posts',
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/PostPatch',
          },
        },
      },
    },
    responses: {
      ...commonErrors,
      [status]: {
        description: 'Post was successfully updated.',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/PostWithTags',
            },
          },
        },
      },
    },
    security: [{ sessionAuthentication: ['write'] }],
  };

  return patch;
}
