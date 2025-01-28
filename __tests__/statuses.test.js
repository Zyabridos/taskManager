// @ts-check

import fastify from 'fastify';

import init from '../server/plugin.js';
import { prepareData, makeLogin } from './helpers/index.js';

describe('test statuses CRUD', () => {
  let app;
  let knex;
  let models;
  let testData;
  let cookie;

  beforeAll(async () => {
    app = fastify({
      exposeHeadRoutes: false,
      logger: { target: 'pino-pretty' },
    });
    await init(app);
    knex = app.objection.knex;
    models = app.objection.models;

    // TODO: пока один раз перед тестами
    // тесты не должны зависеть друг от друга
    // перед каждым тестом выполняем миграции
    // и заполняем БД тестовыми данными
    await knex.migrate.latest();
    testData = await prepareData(app);
  });

  beforeEach(async () => {
    cookie = await makeLogin(app, testData.users.existing.author);
  });

  it('index', async () => {
    const response = await app.inject({
      method: 'GET',
      // url: app.reverse('statuses'),
      url: '/statuses',
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      // url: app.reverse('newStatus'),
      url: '/statuses/new',
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  // work under progress
  it('create', async () => {
    const params = testData.statuses.new;
    const response = await app.inject({
      method: 'POST',
      // url: app.reverse('createStatus'),
      url: '/statuses/new',
      payload: {
        data: params,
      },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
    const status = await models.status.query().findOne({ name: params.name });
    expect(status).toMatchObject(params);
  });

  // work under progress
  it('delete', async () => {
    const params = testData.statuses.existing.delete;
    const statusToDelete = await models.status
      .query()
      .findOne({ name: params.name });
    const response = await app.inject({
      method: 'DELETE',
      // url: app.reverse('deleteStatus', { id: status.id }),
      url: `/users/${statusToDelete.id}`,
      payload: {
        data: params,
      },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
    const deletedStatus = await models.status
      .query()
      .findOne({ name: params.name });
    expect(deletedStatus).toBeUndefined();
  });

  // work under progress
  it('update', async () => {
    const params = testData.statuses.existing.update;
    const statusToDelete = await models.status
      .query()
      .findOne({ name: params.name });
    const updatedStatusName = 'updated';
    const response = await app.inject({
      method: 'PATCH',
      // url: app.reverse('updateStatus', { id: statusToDelete.id }),
      url: `/users/${statusToDelete.id}`,
      payload: {
        data: { name: updatedStatusName },
      },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);

    const updatedStatus = await statusToDelete.$query();
    expect(updatedStatus.name).toEqual(updatedStatusName);
  });

  afterEach(async () => {
    // после каждого теста откатываем миграции
    // await knex.migrate.rollback();
  });

  afterAll(async () => {
    await app.close();
  });
});

// npx jest __tests__/statuses.test.js
