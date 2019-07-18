import { initialize } from 'express-openapi';

import { UnauthenticatedError, UnauthorizedError } from '../errors';
import db from '../db';

import Posts from './paths/posts';
import PostsId from './paths/posts/{id}';
import Bulk from './paths/posts/bulk';
import Refresh from './paths/refresh';
import Invitation from './paths/invitation';
import Tags from './paths/tags';
import TagPosts from './paths/tags/{tagId}/posts';
import Login from './paths/login';
import Logout from './paths/logout';
import Invitation from './paths/invitation';
import User from './paths/user';
import UploadUrl from './paths/upload';
import v1ApiDoc from './api-doc';
import posts from './services/posts';
import tags from './services/tags';
import aws from './services/aws';

export const paths = [
  {
    path: '/posts/',
    module: Posts,
  },
  {
    path: '/posts/{id}',
    module: PostsId,
  },
  {
    path: '/posts/bulk',
    module: Bulk,
  },
  {
    path: '/tags/',
    module: Tags,
  },
  {
    path: '/tags/{tagId}/posts',
    module: TagPosts,
  },
  {
    path: '/login/',
    module: Login,
  },
  {
    path: '/logout/',
    module: Logout,
  },
  {
    path: '/refresh/',
    module: Refresh,
  },
  {
    path: '/user/',
    module: User,
  },
  {
    path: '/upload/',
    module: UploadUrl,
  },
  {
    path: '/invitation/',
    module: Invitation,
  },
];

export default function initializeSwagger(app) {
  return initialize({
    app,
    // NOTE: If using yaml you can provide a path relative to process.cwd() e.g.
    // apiDoc: './api-v1/api-doc.yml',
    apiDoc: v1ApiDoc,
    paths,
    dependencies: {
      db,
      posts,
      tags,
      aws,
    },
    errorMiddleware: (err, req, res, next) => { // eslint-disable-line
      if (!err.status) {
        res.status(500).json({
          status: 500,
          message: 'Internal Server Error',
          errors: [err],
        });
      } else {
        res.status(err.status).json({
          status: err.status,
          message: err.message,
          errors: err.errors,
        });
      }
    },
    securityHandlers: {
      sessionAuthentication: (req, scopes) => {
        if (!req.session.user) {
          throw new UnauthenticatedError();
        }

        if (!scopes.includes(req.session.user)) {
          throw new UnauthorizedError();
        } else {
          return true;
        }
      },
    },
  });
}
