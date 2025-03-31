/* eslint-env jest */
import dotenv from 'dotenv';
import { setStandardBeforeEach } from './helpers/setUpTestsEnv.js';

dotenv.config({ path: '.env.test' });

describe('test tasks filtering by label, status, and executor (REST API)', () => {
  let app;
  let knex;
  let models;
  let cookie;

  let selectedLabel;
  let selectedStatus;
  let selectedExecutor;
  let taskToFind;

  const getTestContext = setStandardBeforeEach();

  beforeEach(async () => {
    ({ app, knex, models, cookie } = getTestContext());

    const [labels, statuses, users] = await Promise.all([
      models.label.query(),
      models.status.query(),
      models.user.query(),
    ]);

    [selectedLabel] = labels;
    [selectedStatus] = statuses;
    [selectedExecutor] = users;

    taskToFind = await models.task.query().insert({
      name: 'Task with correct data',
      description: 'This task should match filters',
      statusId: selectedStatus.id,
      authorId: 1,
      executorId: selectedExecutor.id,
    });

    await knex('task_labels').insert({
      task_id: taskToFind.id,
      label_id: selectedLabel.id,
    });

    await models.task.query().insert({
      name: 'Task with random data',
      description: 'This task should NOT match filters',
      statusId: selectedStatus.id + 1,
      authorId: 2,
      executorId: selectedExecutor.id + 1,
    });
  });

  const getFilteredTaskNames = async (queryParams) => {
    const searchParams = new URLSearchParams(queryParams).toString();

    const response = await app.inject({
      method: 'GET',
      url: `/api/tasks?${searchParams}`,
      headers: {
        cookie: `session=${cookie.session}`,
        accept: 'application/json',
      },
    });

    expect(response.statusCode).toBe(200);

    const tasks = JSON.parse(response.body);
    return tasks.map((task) => task.name);
  };

  it.each([
    [{ label: () => selectedLabel.id }],
    [{ status: () => selectedStatus.id }],
    [{ executor: () => selectedExecutor.id }],
    [
      {
        label: () => selectedLabel.id,
        status: () => selectedStatus.id,
        executor: () => selectedExecutor.id,
      },
    ],
  ])('should return only tasks matching filters: %p', async (paramSet) => {
    const queryParams = Object.fromEntries(
      Object.entries(paramSet).map(([key, getValue]) => [key, getValue().toString()])
    );

    const taskNames = await getFilteredTaskNames(queryParams);

    expect(taskNames).toContain('Task with correct data');
    expect(taskNames).not.toContain('Task with random data');
  });

  afterEach(async () => {
    await knex('task_labels').del();
    await knex('tasks').del();
  });

  afterAll(async () => {
    await knex.migrate.rollback();
    await app.close();
    await knex.destroy();
  });
});
