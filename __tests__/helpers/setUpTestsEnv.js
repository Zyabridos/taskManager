import fastify from "fastify";
// import init from '../../server/index.js'
import init from '../../server/plugin/init.js'
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

export default async function setUpTestsEnv() {
  const app = fastify({
    exposeHeadRoutes: false,
    logger: { target: "pino-pretty" },
  });

  await init(app);
  const knex = app.objection.knex;
  const models = app.objection.models;

  await knex.migrate.latest();

  return { app, knex, models };
}
