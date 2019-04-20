import { commonErrors } from '../../../refs/error';

const responseCode = 204;

export default function(posts) {
  const bulkDelete = async function(req, res, next) {
    const { ids } = req.body;
    try {
      const response = await posts.bulkDelete(ids);
      res.status(responseCode).json(response);
    } catch (e) {
      next(e);
    }
  };

  bulkDelete.apiDoc = {
    description: 'Delete bulk posts',
    operationId: 'deleteBulkPosts',
    tags: ['posts', 'bulk', 'write'],
    requestBody: {
      description: 'Request body for posts',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['ids'],
            properties: {
              ids: {
                description: 'Array of ids to delete',
                type: 'array',
                items: {
                  type: 'string',
                  format: 'uuid',
                  description: 'uuid of post',
                },
              },
            },
          },
        },
      },
    },
    responses: {
      ...commonErrors,
      [responseCode]: {
        description: 'Posts were successfully updated',
      },
    },
    security: [{ sessionAuthentication: ['write'] }],
  };

  return bulkDelete;
}
