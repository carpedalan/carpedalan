// Update with your config settings.

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
    },
    seeds: {
      directory: './seeds',
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
      tableName: 'migrations/carpedalan',
    },
  },

  production: {
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
      tableName: 'migrations/carpedalan',
    },
  },
};
