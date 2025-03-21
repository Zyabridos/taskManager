import fastify from 'fastify';
import dotenv from 'dotenv';
import init from '../../server/plugin/init.js';

dotenv.config({ path: '.env.test' });

export default async function setUpTestsEnv() {
  const app = fastify({
    exposeHeadRoutes: false,
    logger: { target: 'pino-pretty' },
  });

  await init(app);
  const { knex, models } = app.objection;

  await knex.migrate.latest();

  return { app, knex, models };
}
