// args.apiDoc needs to be a js object.  This file could be a json file, but we can't add
// comments in json files.

import { READ_USER, WRITE_USER } from '../server/constants';

import { setCloudfrontCookie } from './middlewares';
import PostSchema, { PostWithTags, PostPatch } from './refs/post';
import PostList from './refs/postList';
import Tag from './refs/tag';
import Error from './refs/error';

export default {
  openapi: '3.0.0',

  servers: [
    {
      url: 'https://local.carpedalan.com/v1',
      description: 'local',
    },
    {
      url: 'https://carpedalan.com/v1',
      description: 'production',
    },
    {
      url: 'https://carpe.dalan.dev/v1',
      description: 'staging',
    },
  ],

  info: {
    title: 'Carpe Dalan dot com API',
    version: '1.0.0',
  },

  components: {
    schemas: {
      Post: PostSchema,
      PostWithTags,
      Tag,
      Error,
      PostList,
      PostPatch,
    },
    securitySchemes: {
      sessionAuthentication: {
        type: 'apiKey',
        in: 'cookie',
        name: 'user_sid',
      },
    },
  },

  paths: {},

  // tags is optional, and is generated / sorted by the tags defined in your path
  // docs.  This API also defines 2 tags in operations: "creating" and "fooey".
  tags: [
    // {name: 'creating'} will be inserted by ./api-routes/users.js
    // {name: 'fooey'} will be inserted by ./api-routes/users/{id}.js
    { description: 'Post Operations', name: 'posts' },
    { description: 'Bulk operations', name: 'bulk' },
    { description: 'Login/User operations', name: '_user' },
    { description: 'Tag operations', name: 'tags' },
    { description: 'Operations for read users', name: 'read' },
    { description: 'Operations for write users', name: 'write' },
  ],
  security: [
    {
      sessionAuthentication: [READ_USER, WRITE_USER],
    },
  ],
  'x-express-openapi-additional-middleware': [
    (req, res, next) => {
      setCloudfrontCookie(res);
      next();
    },
  ],
};
