// Update with your config settings.
const path = require('path');

const dotenv = require('dotenv-safe');

const isMigrating = !!process.env.MIGRATING;
dotenv.config({
  path: path.resolve(process.cwd(), isMigrating ? '..' : '.', '.env'),
  example: path.resolve(
    process.cwd(),
    isMigrating ? '..' : '.',
    '.env.example',
  ),
});
console.log('console, pg');
module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: 'pg',
      database: 'postgres',
      user: 'postgres',
      password: 'postgres',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './migrations/setup',
    },
    useNullAsDefault: true,
  },

  test: {
    client: 'pg',
    connection: {
      host: process.env.PG_HOST || 'localhost',
      database: 'postgres',
      user: 'postgres',
      password: 'postgres',
      port: process.env.PG_PORT || 5555,
    },
    pool: {
      min: 0,
      max: 10,
    },
    migrations: {
      directory: `./${isMigrating ? '/' : 'db/'}migrations/setup`,
    },
    seeds: {
      directory: './db/seeds',
    },
    useNullAsDefault: true,
  },

  ci: {
    client: 'pg',
    connection: {
      host: process.env.PG_HOST || 'localhost',
      database: 'postgres',
      user: 'postgres',
      password: 'postgres',
      port: 5432,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: path.resolve(__dirname, 'migrations', 'setup'),
    },
    seeds: {
      directory: './db/seeds',
    },
    useNullAsDefault: true,
  },

  staging: {
    client: 'pg',
    connection: {
      database: 'postgres',
      user: 'postgres',
      password: 'postgres',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './migrations/setup',
    },
  },

  production: {
    client: 'pg',
    connection: process.env.PG_URI,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './migrations/setup',
    },
  },
};
