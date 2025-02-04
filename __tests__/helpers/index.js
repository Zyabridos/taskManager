import {
  generateUsers,
  generateStatuses,
  generateTasks,
  generateLabels,
} from "./faker.js";

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
  await knex("users").insert(usersData.seeds);
  await knex("statuses").insert(statusesData.seeds);

  // достаём их обратно, чтобы получить их реальные ID
  const users = await knex("users").select();
  const statuses = await knex("statuses").select();

  console.log("Users in DB:", users);

  const tasksData = generateTasks(users, statuses);

  await knex("tasks").insert(tasksData.seeds);

  if (!users[0]) {
    throw new Error("generateUsers() failed to generate users.");
  }

  return {
    users: usersData,
    statuses: statusesData,
    labels: labelsData,
    tasks: tasksData,
  };
};

export const makeLogin = async (app, userData) => {
  if (!userData || !userData.email || !userData.password) {
    throw new Error("makeLogin() called with invalid user data");
  }

  console.log("Trying to login with:", userData.email);

  const user = await app.objection.models.user
    .query()
    .findOne({ email: userData.email });

  if (!user) {
    throw new Error(`User with email ${userData.email} not found in DB`);
  }

  const responseSignIn = await app.inject({
    method: "POST",
    // url: app.reverse('session'),
    url: "/session",
    payload: { data: userData },
  });

  console.log("Login response:", responseSignIn.payload);
  console.log("Cookies:", responseSignIn.cookies);

  if (!responseSignIn.cookies.length) {
    throw new Error(`Login failed: No session cookie received.`);
  }

  const [sessionCookie] = responseSignIn.cookies;
  const { name, value } = sessionCookie;
  return { [name]: value };
};