

const path = require('path');

const dotenv = require('dotenv');
const knex = require('knex');
const config = require('../../db/knexfile');
const db = require('../../server/db').default;
dotenv.config({ path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`) });
const connection = knex(config[process.env.NODE_ENV]);
beforeEach(async () => {
  await connection.seed.run();
})

afterAll(async () => {
  await connection.destroy();
  await db.destroy();
})