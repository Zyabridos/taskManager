import {
  generateUsers,
  generateStatuses,
  generateTasks,
  generateLabels,
} from "./faker.js";

// TODO: использовать для фикстур https://github.com/viglucci/simple-knex-fixtures

export const getTestData = () => {
  const users = generateUsers();
  const statuses = generateStatuses();
  const labels = generateLabels();

  const tasks = generateTasks(users.seeds, statuses.seeds);
  return { users, statuses, labels, tasks };
};

export const prepareData = async (app) => {
  // TODO так как лейбел не обязательный,
  // надо будеи сгенерировать такую таскДату, чтобы была с лейблами
  // и проверть, что ее нельзя удалить
  // const tasksData = generateTasks(users, statuses);
  // const labels = await knex("labels").select();
  const { knex } = app.objection;

  const usersData = generateUsers();
  const statusesData = generateStatuses();
  const labelsData = generateLabels();

  // вставляем все данные в БД (= INSERT INTO...)
  await knex("users").insert(usersData.seeds);
  await knex("statuses").insert(statusesData.seeds);
  await knex("labels").insert(labelsData.seeds);

  // достаём их обратно, чтобы получить их реальные ID
  const users = await knex("users").select();
  const statuses = await knex("statuses").select();

  const tasksData = generateTasks(users, statuses);
  await knex("tasks").insert(tasksData.seeds);

  return {
    users: usersData,
    statuses: statusesData,
    labels: labelsData,
    tasks: tasksData,
  };
};

export const makeLogin = async (app, userData) => {
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

  // console.log("Login response:", responseSignIn.payload);
  // console.log("Cookies:", responseSignIn.cookies);

  const [sessionCookie] = responseSignIn.cookies;
  const { name, value } = sessionCookie;
  return { [name]: value };
};
