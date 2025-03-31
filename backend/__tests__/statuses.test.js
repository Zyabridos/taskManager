import dotenv from 'dotenv';
import { findEntity } from './helpers/utils.js';
import { setStandardBeforeEach } from './helpers/setUpTestsEnv.js';

dotenv.config({ path: '.env.test' });

describe('test statuses CRUD (REST API)', () => {
  let app;
  let knex;
  let models;
  let testData;
  let cookie;

  const getTestContext = setStandardBeforeEach();

  beforeEach(() => {
    ({ app, knex, models, testData, cookie } = getTestContext());
  });

  async function checkStatusExists(name) {
    return findEntity(models.status, 'name', name);
  }

  it('should return a list of statuses', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/statuses',
      headers: { cookie: `session=${cookie.session}` },
    });

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(JSON.parse(response.body))).toBe(true);
  });

  it('should create a new status', async () => {
    const params = testData.statuses.new;

    const response = await app.inject({
      method: 'POST',
      url: '/api/statuses',
      headers: {
        cookie: `session=${cookie.session}`,
        'content-type': 'application/json',
      },
      payload: JSON.stringify(params),
    });

    expect(response.statusCode).toBe(201);

    const status = await checkStatusExists(params.name);
    expect(status).toMatchObject(params);
  });

  it('should update a status', async () => {
    const params = testData.statuses.existing.update;
    const statusToUpdate = await checkStatusExists(params.name);
    expect(statusToUpdate).toBeDefined();

    const newName = 'Updated Status';

    const response = await app.inject({
      method: 'PATCH',
      url: `/api/statuses/${statusToUpdate.id}`,
      headers: {
        cookie: `session=${cookie.session}`,
        'content-type': 'application/json',
      },
      payload: JSON.stringify({ name: newName }),
    });

    expect(response.statusCode).toBe(200);

    const updatedStatus = await models.status.query().findById(statusToUpdate.id);
    expect(updatedStatus.name).toEqual(newName);
  });

  it('should delete a status without tasks', async () => {
    const tempStatus = await models.status.query().insert({ name: 'Temp Status' });

    const response = await app.inject({
      method: 'DELETE',
      url: `/api/statuses/${tempStatus.id}`,
      headers: { cookie: `session=${cookie.session}` },
    });

    expect(response.statusCode).toBe(200);

    const deletedStatus = await models.status.query().findById(tempStatus.id);
    expect(deletedStatus).toBeUndefined();
  });

  it('should NOT delete status if it has related tasks', async () => {
    const statusToDelete = await checkStatusExists(testData.statuses.existing.delete.name);

    await models.task.query().insert({
      name: 'Task with status',
      description: 'Test task for status relation',
      statusId: statusToDelete.id,
      authorId: 1,
      executorId: 1,
    });

    const response = await app.inject({
      method: 'DELETE',
      url: `/api/statuses/${statusToDelete.id}`,
      headers: { cookie: `session=${cookie.session}` },
    });

    expect(response.statusCode).toBe(400);

    const stillExists = await models.status.query().findById(statusToDelete.id);
    expect(stillExists).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
    await knex.destroy();
  });
});
