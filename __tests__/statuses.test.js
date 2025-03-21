import dotenv from 'dotenv';
import { prepareData, makeLogin } from './helpers/index.js';
import { checkResponseCode, findEntity } from './helpers/utils.js';
import setUpTestsEnv from './helpers/setUpTestsEnv.js';

dotenv.config({ path: '.env.test' });

describe('test statuses CRUD', () => {
  let app;
  let models;
  let knex;
  let testData;
  let cookie;

  beforeEach(async () => {
    ({ app, knex, models } = await setUpTestsEnv());
    await knex.migrate.rollback();
    await knex.migrate.latest();
    testData = await prepareData(app);
    cookie = await makeLogin(app, testData.users.existing.author);
  });

  async function checkStatusExists(name) {
    return findEntity(models.status, 'name', name);
  }

  it('should show a list of statuses', async () => {
    await checkResponseCode(app, 'GET', '/statuses', cookie);
  });

  it('should display new status creation page', async () => {
    await checkResponseCode(app, 'GET', '/statuses/new', cookie);
  });

  it('should create a new status', async () => {
    const params = testData.statuses.new;
    await checkResponseCode(app, 'POST', '/statuses', cookie, params, 302);

    const status = await checkStatusExists(params.name);
    expect(status).toMatchObject(params);
  });

  it('should delete a status', async () => {
    const params = testData.statuses.existing.delete;
    const statusToDelete = await checkStatusExists(params.name);
    expect(statusToDelete).toBeDefined();

    await checkResponseCode(
      app,
      'DELETE',
      `/statuses/${statusToDelete.id}`,
      cookie,
      null,
      302,
    );

    const deletedStatus = await checkStatusExists(params.name);
    expect(deletedStatus).toBeUndefined();
  });
  it('should NOT be deleted when it has a task', async () => {
    const statusToDelete = await models.status
      .query()
      .findOne({ name: testData.statuses.existing.delete.name });
    expect(statusToDelete).toBeDefined();

    await models.task.query().insert({
      name: 'Test task with status',
      description: 'This task is linked to a status',
      statusId: statusToDelete.id,
      authorId: 1,
      executorId: 1,
    });

    expect(
      await models.status.query().findOne({ name: statusToDelete.name }),
    ).toBeDefined();
  });

  it('should update a status', async () => {
    const params = testData.statuses.existing.update;
    const statusToUpdate = await checkStatusExists(params.name);
    expect(statusToUpdate).toBeDefined();

    const updatedStatusName = 'Updated Status';
    await checkResponseCode(
      app,
      'PATCH',
      `/statuses/${statusToUpdate.id}`,
      cookie,
      { name: updatedStatusName },
      302,
    );

    const updatedStatus = await models.status
      .query()
      .findById(statusToUpdate.id);
    expect(updatedStatus.name).toEqual(updatedStatusName);
  });

  afterAll(async () => {
    await app.close();
  });
});

// npx jest __tests__/statuses.test.js
