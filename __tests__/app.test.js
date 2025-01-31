import { describe, beforeAll, it, expect } from '@jest/globals';

import fastify from 'fastify';
import init from '../server/plugin/index.js';

describe('requests', () => {
  let app;

  beforeAll(async () => {
    app = fastify({
      exposeHeadRoutes: false, // отключаем автоматическую регистрацию маршрутов HEAD
      logger: { target: 'pino-pretty' }, // просто логгер для красивого форматирования
    });
    await init(app);
  });

  it('GET 200', async () => {
    // отправляем GET-запрос на корневой маршрут.
    const res = await app.inject({
      method: 'GET',
      // url: app.reverse('root'),
      url: '/',
    });
    expect(res.statusCode).toBe(200);
  });

  it('GET 404', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/wrong-path',
    });
    expect(res.statusCode).toBe(404);
  });

  afterAll(async () => {
    await app.close(); // закрываем экземпляр Fastify, чтобы освободить ресурсы.
  });
});
