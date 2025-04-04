import dotenv from 'dotenv';
import fastify from 'fastify';
import init from '../server/plugin/init.js';
import { prepareData, makeLogin } from './helpers/index.js';

dotenv.config({ path: '.env.test' });

describe('test tasks CRUD', () => {
  let app;
  let models;
  let knex;
  let testData;
  let cookie;

  beforeEach(async () => {
    app = fastify({
      exposeHeadRoutes: false,
      logger: { target: 'pino-pretty' },
    });

    await init(app);
    knex = app.objection.knex;
    models = app.objection.models;

    await knex.migrate.latest();

    testData = await prepareData(app);
  });

  beforeEach(async () => {
    cookie = await makeLogin(app, testData.users.existing.author);
  });

  it('index', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/tasks',
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/tasks/new',
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('delete', async () => {
    const params = testData.tasks.existing.delete;
    const taskToDelete = await models.task
      .query()
      .findOne({ name: params.name });

    const response = await app.inject({
      method: 'DELETE',
      url: `/tasks/${taskToDelete.id}`,
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
    const deletedTask = await models.task
      .query()
      .findOne({ name: params.name });
    expect(deletedTask).toBeUndefined();
  });

  it('update', async () => {
    const params = testData.tasks.existing.update;
    const task = await models.task.query().findOne({ name: params.name });

    const updatedTaskName = 'updated';
    const response = await app.inject({
      method: 'PATCH',
      url: `/tasks/${task.id}`,
      payload: {
        data: {
          ...params,
          name: updatedTaskName,
        },
      },
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);

    const updatedTask = await models.task.query().findById(task.id);
    expect(updatedTask.name).toEqual(updatedTaskName);
  });

  afterEach(async () => {
    await knex('tasks').del();
  });

  afterAll(async () => {
    await knex.migrate.rollback();
    await app.close();
  });
});
