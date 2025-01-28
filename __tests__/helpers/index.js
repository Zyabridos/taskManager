import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import { generateUsers, generateStatuses } from './faker.js';

// TODO: использовать для фикстур https://github.com/viglucci/simple-knex-fixtures

export const getTestData = () => ({
  users: generateUsers(),
  statuses: generateStatuses(),
});

export const prepareData = async (app) => {
  const { knex } = app.objection;

  const usersData = generateUsers();
  const statusesData = generateStatuses();

  const users = await knex('users');
  const statuses = await knex('statuses');

  await knex('users').insert(usersData.seeds);
  await knex('statuses').insert(statusesData.seeds);

  return {
    users: usersData,
    statuses: statusesData,
  };
};

export const makeLogin = async (app, userData) => {
  const responseSignIn = await app.inject({
    method: 'POST',
    // url: app.reverse('session'),
    url: '/session',
    payload: {
      data: userData,
    },
  });
  const [sessionCookie] = responseSignIn.cookies;
  const { name, value } = sessionCookie;
  const cookie = { [name]: value };

  return cookie;
};
