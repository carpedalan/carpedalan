// Update with your config settings.
const path = require('path');

const dotenv = require('dotenv-safe');

const isMigrating = !!process.env.MIGRATING;

if (!process.env.WALLABY) {
  dotenv.config({
    path: path.resolve(process.cwd(), isMigrating ? '..' : '.', '.env'),
    example: path.resolve(
      process.cwd(),
      isMigrating ? '..' : '.',
      '.env.example',
    ),
  });
}
module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: 'pg',
      database: 'carpedalan',
      user: 'postgres',
      password: 'postgres',
    },

    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './migrations/carpedalan',
      tableName: 'carpe_migrations',
    },
    seeds: {
      directory: './seeds',
    },
    useNullAsDefault: true,
  },

  test: {
    client: 'pg',
    connection: {
      host: process.env.PG_HOST || 'localhost',
      database: 'carpedalan',
      user: 'postgres',
      password: 'postgres',
      port: process.env.PG_PORT || 5555,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: `./${isMigrating ? '/' : 'db/'}migrations/carpedalan`,
      tableName: 'carpe_migrations',
    },
    seeds: {
      directory: './server/api-v1/setup/seeds',
    },
    useNullAsDefault: true,
  },

  integration: {
    client: 'pg',
    connection: {
      host: process.env.PG_HOST || 'localhost',
      database: 'carpedalan',
      user: 'postgres',
      password: 'postgres',
      port: process.env.PG_PORT || 5432,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: path.resolve(__dirname, 'migrations', 'carpedalan'),
      tableName: 'carpe_migrations',
    },
    seeds: {
      directory: './server/api-v1/setup/seeds',
    },
    useNullAsDefault: true,
  },

  ci: {
    client: 'pg',
    connection: {
      host: process.env.PG_HOST || 'localhost',
      database: 'carpedalan',
      user: 'postgres',
      password: 'postgres',
      port: process.env.PG_PORT || 5432,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: path.resolve(__dirname, 'migrations', 'carpedalan'),
      tableName: 'carpe_migrations',
    },
    seeds: {
      directory: './server/api-v1/setup/seeds',
    },
    useNullAsDefault: true,
  },
  e2e: {
    client: 'pg',
    connection: {
      host: process.env.PG_HOST || 'localhost',
      database: 'carpedalan',
      user: 'postgres',
      password: 'postgres',
      port: process.env.PG_PORT || 5432,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: path.resolve(__dirname, 'migrations', 'carpedalan'),
      tableName: 'carpe_migrations',
    },
    seeds: {
      directory: './db/seeds-e2e',
    },
    useNullAsDefault: true,
  },

  staging: {
    client: 'pg',
    connection: {
      database: 'carpedalan',
      user: 'postgres',
      password: 'postgres',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './migrations/carpedalan',
      tableName: 'carpe_migrations',
    },
  },

  production: {
    client: 'pg',
    connection: process.env.PG_URI2 || process.env.PG_URI,
    pool: {
      min: 2,
      max: 200,
    },
    migrations: {
      directory: './migrations/carpedalan',
      tableName: 'carpe_migrations',
    },
  },
};
