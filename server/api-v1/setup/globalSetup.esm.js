import knex from 'knex';
// import docker from 'docker-compose';

import setupDb from '../../../db/setup';
import config from '../../../db/knexfile';
/* eslint-disable no-restricted-syntax,no-await-in-loop,no-console */
console.error('process.env.NODE_ENV', process.env.NODE_ENV);

const main = async () => {
  const attempts = [1, 2, 3, 4, 5, 6, 8, 9, 10];
  let success = false;
  let setupConnection;

  for (const attempt of attempts) {
    try {
      setupConnection = await knex(setupDb[process.env.NODE_ENV]);
      await setupConnection.migrate.latest();
      const connection = await knex(config[process.env.NODE_ENV]);
      await connection.migrate.latest();
      // await connection.seed.run();
      console.log('\nMigration Complete'); // eslint-disable-line no-console
      setupConnection.destroy();
      connection.destroy();

      success = true;
      break;
    } catch (e) {
      console.log(e);
      console.log(`Attempt: ${attempt}: Cant connect yet. Trying again...`); // eslint-disable-line no-console
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  /* eslint-enable no-restricted-syntax */
  if (success) {
    return Promise.resolve();
  }
  throw Error('Couldnt connect');
};

module.exports = main;
