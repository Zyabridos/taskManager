import { faker } from "@faker-js/faker";
import _ from "lodash";
import encrypt from "../../server/lib/secure.cjs";

const generators = {
  user: () => ({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  }),
  status: () => ({
    name: faker.word.noun(),
  }),
  task: () => ({
    name: faker.word.noun(),
    description: faker.lorem.sentence(),
  }),
  label: () => ({
    name: faker.word.noun(),
  }),
};

export const generateData = (type, length = 3) =>
  Array.from({ length }, () => generators[type]());

export const generateUsers = () => {
  const newUser = generateData("user", 1);
  const users = generateData("user", 5);
  // move to fixtures
  const fixedUser = {
    firstName: 'Alice',
    lastName: 'Ramsey',
    email: 'alice@example.com',
    password: faker.internet.password(),
  }
  const seeds = users.map((user) => ({
    ..._.omit(user, "password"),
    passwordDigest: encrypt(user.password),
  }));

  // пусть пока так будет...
  seeds.push({
    ..._.omit(fixedUser, "password"),
    passwordDigest: encrypt(fixedUser.password),
  });

  return {
    new: newUser[0],
    existing: {
      author: users[0],
      executor: users[1],
      delete: users[2],
      fixed: fixedUser, 
    },
    seeds,
  };
};

export const generateStatuses = () => {
  const newStatus = generateData("status", 1);
  const statuses = generateData("status", 2);
  return {
    new: newStatus[0],
    existing: {
      update: statuses[0],
      delete: statuses[1],
    },
    seeds: statuses,
  };
};

export const generateTasks = (users, statuses) => {
  const tasks = generateData("task", 3).map((task, index) => ({
    ...task,
    statusId: statuses[index % statuses.length].id,
    authorId: users[0].id, // первый юзер — автор
    executorId: users[1].id, // второй созданный нами юзер — исполнитель
  }));

  return {
    new: generateData("task", 1)[0],
    existing: {
      update: tasks[0],
      delete: tasks[1],
    },
    seeds: tasks,
  };
};

export const generateLabels = () => {
  const newLabel = generateData("label", 1);
  const labels = generateData("label", 2);
  return {
    new: newLabel[0],
    existing: {
      update: labels[0],
      delete: labels[1],
    },
    seeds: labels,
  };
};