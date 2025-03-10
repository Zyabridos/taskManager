import {
  generateUsers,
  generateStatuses,
  generateTasks,
  generateLabels,
} from "./faker.js";

export const getTestData = () => {
  const users = generateUsers();
  const statuses = generateStatuses();
  const labels = generateLabels();

  const tasks = generateTasks(users.seeds, statuses.seeds);
  return { users, statuses, labels, tasks };
};

export const prepareData = async (app) => {
  const { knex } = app.objection;

  const usersData = generateUsers();
  const statusesData = generateStatuses();
  const labelsData = generateLabels();

  await knex("users").insert(usersData.seeds);
  await knex("statuses").insert(statusesData.seeds);
  await knex("labels").insert(labelsData.seeds);

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
    url: "/session",
    payload: { data: userData },
  });

  const [sessionCookie] = responseSignIn.cookies;
  const { name, value } = sessionCookie;
  return { [name]: value };
};
