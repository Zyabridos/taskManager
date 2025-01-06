import fastify from 'fastify';
import { faker } from '@faker-js/faker';
// import userRoutes from '../server/routes/users.js';
import init from '../server/index.js';
import dbMock from './helpers/dbMock.js';
import cleanTestData from './helpers/cleanTestData.js'
import prepareTestData from './helpers/prepareTestData.js'

describe('User Routes', () => {
  let app;

  beforeAll(async () => {
    app = fastify();
    await app.register(init, { db: dbMock });
    await prepareTestData(dbMock); // Prepare mock data in the database
  });

  afterAll(async () => {
    await cleanTestData(dbMock); // Clean up mock data
    await app.close();
  });

  test('GET /users - should return a list of users', async () => {
    const response = await app.inject({
      method: 'GET',
      // url: '/users',
      url: app.reverse('users'),
    });

    expect(response.statusCode).toBe(200);
    expect(response.payload).toContain('Список пользователей'); // Check for table title in response
    const parsedPayload = JSON.parse(response.payload);
    expect(parsedPayload.data.users).toBeInstanceOf(Array);
  });

  test('GET /users/new - should return the registration form', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/users/new',
    });

    expect(response.statusCode).toBe(200);
    expect(response.payload).toContain('Форма регистрации'); // Check for form title
  });

  test('POST /users - should create a new user', async () => {
    const newUser = {
      'data[firstName]': faker.person.firstName(),
      'data[lastName]': faker.person.lastName(),
      'data[email]': faker.internet.email(),
      'data[password]': faker.internet.password(8),
    };

    const response = await app.inject({
      method: 'POST',
      url: '/users',
      payload: newUser,
    });

    expect(response.statusCode).toBe(302); // Expect redirect after successful creation
    expect(response.headers.location).toBe('/users');
  });

  test('GET /users/:id/edit - should return the edit form for a user', async () => {
    const userId = 1; // Assume this ID exists in test data
    const response = await app.inject({
      method: 'GET',
      url: `/users/${userId}/edit`,
    });

    expect(response.statusCode).toBe(200);
    expect(response.payload).toContain('Форма редактирования'); // Check for form title
  });

  test('PATCH /users/:id/edit - should update a user', async () => {
    const userId = 1; // Assume this ID exists in test data
    const updatedUser = {
      'data[firstName]': faker.person.firstName(),
      'data[lastName]': faker.person.lastName(),
      'data[email]': faker.internet.email(),
    };

    const response = await app.inject({
      method: 'PATCH',
      url: `/users/${userId}/edit`,
      payload: updatedUser,
    });

    expect(response.statusCode).toBe(302); // Expect redirect after successful update
    expect(response.headers.location).toBe(`/users/${userId}`);
  });
});
