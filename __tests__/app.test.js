import { describe, beforeAll, it } from '@jest/globals';
import fastify from 'fastify';
import init from '../server/plugin/init.js';
import dotenv from 'dotenv';
import setUpTestsEnv from './helpers/setUpTestsEnv.js';

dotenv.config({ path: '.env.test' });

describe('requests', () => {
  let app;

  beforeAll(async () => {
    app = fastify({
      exposeHeadRoutes: false,
      logger: { target: 'pino-pretty' },
    });
    await init(app);
  });

  it('GET / should return 200', async () => {
    await setUpTestsEnv(app, 'GET', '/');
  });

  it('GET /wrong-path should return 404', async () => {
    await setUpTestsEnv(app, 'GET', '/wrong-path', null, null, 404);
  });

  afterAll(async () => {
    await app.close();
  });
});
