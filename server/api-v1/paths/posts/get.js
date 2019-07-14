// Showing that you don't need to have apiDoc defined on methodHandlers.

import { commonErrors } from '../../refs/error';
import { BadRequestError } from '../../../errors';
import {
  CREATEDAT,
  DATE,
  DESCRIPTION,
  ETAG,
  EXIFPROPS,
  ID,
  KEY,
  ORIGINALURL,
  STATUS,
  TIMESTAMP,
  UPDATEDAT,
} from '../../../../shared/constants';

const status = 200;

export default function(posts) {
  async function get(req, res, next) {
    const { order, page, isPending, fields, ...rest } = req.query;
    if (Object.keys(rest).length > 0) {
      return next(
        new BadRequestError(
          'You provided extra query params',
          Object.keys(rest).map(param => ({
            type: 'addtionalProperties',
            message: `${param} is not a valid query param`,
          })),
        ),
      );
    }
    const response = await posts.getAll({
      order,
      page,
      isPending,
      fields,
    });
    return res.status(status).json(response);
  }

  get.apiDoc = {
    description: 'Get Posts',
    operationId: 'getPosts',
    tags: ['posts', 'read'],
    parameters: [
      {
        in: 'query',
        name: 'order',
        schema: {
          type: 'string',
          enum: ['asc', 'desc'],
          default: 'desc',
          description: 'Order of query of posts',
        },
      },
      {
        in: 'query',
        name: 'page',
        schema: {
          type: 'integer',
          minimum: 1,
          default: 1,
        },
        description: 'Page of posts query',
      },
      {
        in: 'query',
        name: 'isPending',
        schema: {
          type: 'boolean',
        },
        description: 'Filter by `isPending` on column',
      },
      {
        in: 'query',
        name: 'fields',
        schema: {
          type: 'array',
          items: {
            type: 'string',
            enum: [
              ID,
              TIMESTAMP,
              DATE,
              ORIGINALURL,
              DESCRIPTION,
              ETAG,
              KEY,
              CREATEDAT,
              UPDATEDAT,
              STATUS,
              ...Object.values(EXIFPROPS),
            ],
          },
        },
        description: 'Fields to return in the response',
      },
    ],
    responses: {
      ...commonErrors,
      [status]: {
        description: 'Users were successfully deleted.',
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
