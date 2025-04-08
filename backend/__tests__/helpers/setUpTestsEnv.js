import fastify from 'fastify';
import dotenv from 'dotenv';
import init from '../../server/plugin/init.js';
import { prepareData, makeLogin } from './index.js';

dotenv.config({ path: '.env.test' });

export async function setUpTestsEnv() {
  const app = fastify({
    exposeHeadRoutes: false,
    logger: { target: 'pino-pretty' },
  });

  await init(app);
  const { knex, models } = app.objection;

  await knex.migrate.latest();

  return {
    app,
    knex,
    models,
  };
}

export function setStandardBeforeEach(getAuthor = (data) => data.users.existing.author) {
  let app;
  let knex;
  let models;
  let testData;
  let cookie;

  beforeEach(async () => {
    ({ app, knex, models } = await setUpTestsEnv());
    await knex.migrate.rollback();
    await knex.migrate.latest();
    testData = await prepareData(app);
    cookie = await makeLogin(app, getAuthor(testData));
  });

  afterEach(async () => {
    await app.close(); // важно!
    await knex.destroy(); // тоже обязательно
  });

  return () => ({
    app,
    knex,
    models,
    testData,
    cookie,
  });
}
