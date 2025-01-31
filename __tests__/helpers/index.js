import {
  generateUsers,
  generateStatuses,
  generateTasks,
  generateLabels,
} from './faker.js';

// TODO: использовать для фикстур https://github.com/viglucci/simple-knex-fixtures

export const getTestData = () => ({
  users: generateUsers(),
  statuses: generateStatuses(),
  labels: generateLabels(),
});

export const prepareData = async (app) => {
  const { knex } = app.objection;

  const usersData = generateUsers();
  const statusesData = generateStatuses();
  const labelsData = generateLabels();

  // вставляем пользователей и статусы в БД
  await knex('users').insert(usersData.seeds);
  await knex('statuses').insert(statusesData.seeds);

  // достаём их обратно, чтобы получить их реальные ID
  const users = await knex('users').select();
  const statuses = await knex('statuses').select();

  const tasksData = generateTasks(users, statuses);

  await knex('tasks').insert(tasksData.seeds);

  return {
    users: usersData,
    statuses: statusesData,
    labels: labelsData,
    tasks: tasksData,
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
