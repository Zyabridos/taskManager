/* eslint-env jest */
import fastify from 'fastify';
import dotenv from 'dotenv';
import init from '../server/plugin/init.js';
import { prepareData, makeLogin } from './helpers/index.js';

dotenv.config({ path: '.env.test' });

describe('test tasks CRUD (REST API)', () => {
  let app;
  let knex;
  let models;
  let testData;
  let cookie;

  beforeEach(async () => {
    app = fastify({ logger: false });
    await init(app);
    knex = app.objection.knex;
    models = app.objection.models;

    await knex.migrate.latest();
    testData = await prepareData(app);
    cookie = await makeLogin(app, testData.users.existing.author);
  });

  it('GET /api/tasks — index', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/tasks',
      headers: {
        cookie: `session=${cookie.session}`,
        accept: 'application/json',
      },
    });

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(JSON.parse(response.body))).toBe(true);
  });

  it('GET /api/tasks/:id — show one task', async () => {
    const params = testData.tasks.existing.update;
    const task = await models.task.query().findOne({ name: params.name });

    const response = await app.inject({
      method: 'GET',
      url: `/api/tasks/${task.id}`,
      headers: {
        cookie: `session=${cookie.session}`,
        accept: 'application/json',
      },
    });

    expect(response.statusCode).toBe(200);
    const taskData = JSON.parse(response.body);
    expect(taskData.name).toBe(params.name);
  });

  it('POST /api/tasks — create task', async () => {
    const params = testData.tasks.new;

    const response = await app.inject({
      method: 'POST',
      url: '/api/tasks',
      headers: {
        cookie: `session=${cookie.session}`,
        'content-type': 'application/json',
      },
      payload: JSON.stringify(params),
    });

    expect(response.statusCode).toBe(201);

    const task = await models.task.query().findOne({ name: params.name });
    expect(task).toMatchObject(params);
  });

  it('PATCH /api/tasks/:id — update task', async () => {
    const params = testData.tasks.existing.update;
    const task = await models.task.query().findOne({ name: params.name });

    const updatedName = 'Updated Task Name';

    const response = await app.inject({
      method: 'PATCH',
      url: `/api/tasks/${task.id}`,
      headers: {
        cookie: `session=${cookie.session}`,
        'content-type': 'application/json',
      },
      payload: JSON.stringify({ ...params, name: updatedName }),
    });

    expect(response.statusCode).toBe(200);

    const updatedTask = await models.task.query().findById(task.id);
    expect(updatedTask.name).toBe(updatedName);
  });

  // Work in progress
  // it('should delete a task without error', async () => {
  //   const taskToDelete = await models.task.query().insert({
  //     name: 'Temp Task',
  //     description: 'For deletion test',
  //     statusId: testData.statuses.existing.default.id,
  //     authorId: testData.users.existing.author.id,
  //     executorId: testData.users.existing.executor.id,
  //   });

  //   const response = await app.inject({
  //     method: 'DELETE',
  //     url: `/api/tasks/${taskToDelete.id}`,
  //     headers: {
  //       cookie: `session=${cookie.session}`,
  //     },
  //   });

  //   expect(response.statusCode).toBe(200);

  //   const deleted = await models.task.query().findById(taskToDelete.id);
  //   expect(deleted).toBeUndefined();
  // });


  afterEach(async () => {
    await knex('task_labels').del();
    await knex('tasks').del();
  });

  afterAll(async () => {
    await knex.migrate.rollback();
    await app.close();
  });
});
