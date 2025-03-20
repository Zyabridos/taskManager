import { prepareData, makeLogin } from './helpers/index.js';
import { expect } from '@jest/globals';
import dotenv from 'dotenv';
import setUpTestsEnv from './helpers/setUpTestsEnv.js';

dotenv.config({ path: '.env.test' });

describe('test tasks filtration by labels, status, and executor', () => {
  let app, 
models, 
knex, 
testData, 
cookie;
  let selectedLabel, 
selectedStatus, 
selectedExecutor;
  let taskWithDataFromDB;

  beforeEach(async () => {
    ({ app, knex, models } = await setUpTestsEnv());
    testData = await prepareData(app);
    cookie = await makeLogin(app, testData.users.existing.author);

    const [labels, statuses, executors] = await Promise.all([
      models.label.query(),
      models.status.query(),
      models.user.query(),
    ]);

    selectedLabel = labels[0];
    selectedStatus = statuses[0];
    selectedExecutor = executors[0];

    taskWithDataFromDB = await models.task.query().insert({
      name: 'Task with correct data',
      description: 'This task should appear in the filtered results',
      statusId: selectedStatus.id,
      authorId: 1,
      executorId: selectedExecutor.id,
    });

    await knex('task_labels').insert({
      task_id: taskWithDataFromDB.id,
      label_id: selectedLabel.id,
    });

    await models.task.query().insert({
      name: 'Task with random data',
      description: 'This task should NOT appear in the filtered results',
      statusId: selectedStatus.id + 1,
      authorId: 2,
      executorId: selectedExecutor.id + 1,
    });
  });

  async function testTaskFilter(filterParams) {
    const response = await app.inject({
      method: 'GET',
      url: '/tasks',
      cookies: cookie,
      query: filterParams,
      headers: { accept: 'application/json' },
    });

    expect(response.statusCode).toBe(200);

    const jsonResponse = JSON.parse(response.body);
    const taskNames = jsonResponse.map((task) => task.name);

    return taskNames;
  }

  it.each([
    [{ label: () => selectedLabel.id.toString() }, 'label'],
    [{ status: () => selectedStatus.id.toString() }, 'status'],
    [{ executor: () => selectedExecutor.id.toString() }, 'executor'],
    [
      {
        label: () => selectedLabel.id.toString(),
        status: () => selectedStatus.id.toString(),
        executor: () => selectedExecutor.id.toString(),
      },
      'all filters',
    ],
  ])(
    'should return only tasks with the selected',
    async (filterParams, filterType) => {
      const resolvedFilters = Object.fromEntries(
        Object.entries(filterParams).map(([key, value]) => [key, value()]),
      );

      const taskNames = await testTaskFilter(resolvedFilters);

      expect(taskNames).toContain('Task with correct data');
      expect(taskNames).not.toContain('Task with random data');
    },
  );

  afterEach(async () => {
    await knex('tasks').del();
  });

  afterAll(async () => {
    await knex.migrate.rollback();
    await app.close();
  });
});
