import dotenv from 'dotenv';
import { expect } from '@jest/globals';

import { setStandardBeforeEach } from './helpers/setUpTestsEnv.js';

dotenv.config({ path: '.env.test' });

describe('test tasks filtration by labels, status, and executor', () => {
  let app;
  let models;
  let knex;
  let cookie;

  let selectedLabel;
  let selectedStatus;
  let selectedExecutor;
  let taskWithDataFromDB;

  const getTestContext = setStandardBeforeEach();

  beforeEach(() => {
    ({
      app,
      knex,
      models,
      testData,
      cookie,
    } = getTestContext());
  });

    const [labels, statuses, users] = await Promise.all([
      models.label.query(),
      models.status.query(),
      models.user.query(),
    ]);

    [selectedLabel] = labels;
    [selectedStatus] = statuses;
    [selectedExecutor] = users;

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
    return jsonResponse.map((task) => task.name);
  }

  it.each([
    [{ label: () => selectedLabel.id.toString() }],
    [{ status: () => selectedStatus.id.toString() }],
    [{ executor: () => selectedExecutor.id.toString() }],
    [
      {
        label: () => selectedLabel.id.toString(),
        status: () => selectedStatus.id.toString(),
        executor: () => selectedExecutor.id.toString(),
      },
    ],
  ])('should return only tasks with the selected filter', async (filterParams) => {
    const resolvedFilters = Object.fromEntries(
      Object.entries(filterParams).map(([key, value]) => [key, value()]),
    );

    const taskNames = await testTaskFilter(resolvedFilters);

    expect(taskNames).toContain('Task with correct data');
    expect(taskNames).not.toContain('Task with random data');
  });

  afterEach(async () => {
    await knex('tasks').del();
  });

  afterAll(async () => {
    await knex.migrate.rollback();
    await app.close();
    await knex.destroy();
  });
});
