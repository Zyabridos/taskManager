import dotenv from 'dotenv';
import { setStandardBeforeEach } from './helpers/setUpTestsEnv.js';

dotenv.config({ path: '.env.test' });

describe('test labels CRUD (REST API)', () => {
  let app;
  let knex;
  let models;
  let testData;
  let cookie;

  const getTestContext = setStandardBeforeEach();

  beforeEach(() => {
    ({ app, knex, models, testData, cookie } = getTestContext());
  });

  it('should return a list of labels', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/labels',
      headers: {
        cookie: `session=${cookie.session}`,
      },
    });

    expect(response.statusCode).toBe(200);
    const labels = JSON.parse(response.body);
    expect(Array.isArray(labels)).toBe(true);
  });

  it('should create a new label', async () => {
    const params = testData.labels.new;

    const response = await app.inject({
      method: 'POST',
      url: '/api/labels',
      payload: params,
      headers: {
        cookie: `session=${cookie.session}`,
      },
    });

    expect(response.statusCode).toBe(201);
    const created = JSON.parse(response.body);
    expect(created.name).toBe(params.name);
  });

  it('should update a label', async () => {
    const label = await models.label.query().insert({ name: 'Label To Update' });

    const response = await app.inject({
      method: 'PATCH',
      url: `/api/labels/${label.id}`,
      payload: { name: 'Updated Label' },
      headers: {
        cookie: `session=${cookie.session}`,
      },
    });

    expect(response.statusCode).toBe(200);

    const updated = await models.label.query().findById(label.id);
    expect(updated.name).toBe('Updated Label');
  });

  it('should delete a label without tasks', async () => {
    const labelToDelete = await models.label.query().insert({ name: 'Temp Label' });

    const response = await app.inject({
      method: 'DELETE',
      url: `/api/labels/${labelToDelete.id}`,
      headers: {
        cookie: `session=${cookie.session}`,
      },
    });

    expect(response.statusCode).toBe(200);

    const deleted = await models.label.query().findById(labelToDelete.id);
    expect(deleted).toBeUndefined();
  });

  afterAll(async () => {
    await app.close();
    await knex.destroy();
  });
});
