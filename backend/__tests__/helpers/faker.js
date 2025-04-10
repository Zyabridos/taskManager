import { faker } from '@faker-js/faker';
import _ from 'lodash';
import encrypt from '../../server/lib/secure.cjs';

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

export const generateData = (type, length = 3) => Array.from({ length }, () => generators[type]());

const generateUserWithPassword = (user) => ({
  ..._.omit(user, 'password'),
  passwordDigest: encrypt(user.password),
});

export const generateUsers = () => {
  const newUser = generateData('user', 1)[0];
  const users = generateData('user', 5);

  const fixedUser = {
    firstName: 'Alice',
    lastName: 'Ramsey',
    email: 'alice@example.com',
    password: faker.internet.password(),
  };

  const seeds = [...users.map(generateUserWithPassword), generateUserWithPassword(fixedUser)];

  return {
    new: newUser,
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
  const newStatus = generateData('status', 1);
  const statuses = generateData('status', 2);
  return {
    new: newStatus[0],
    existing: {
      update: statuses[0],
      delete: statuses[1],
    },
    seeds: statuses,
  };
};

export const generateLabels = () => {
  const newLabel = {
    ...generateData('label', 1)[0],
    id: Math.round(Math.random() * 1000),
  };
  const labels = generateData('label', 2).map((label) => ({
    ...label,
    id: Math.round(Math.random() * 1000),
  }));

  return {
    new: newLabel,
    existing: {
      update: labels[0],
      delete: labels[1],
    },
    seeds: labels,
  };
};

export const generateTasks = (users, statuses) => {
  const tasks = generateData('task', 2).map((task, index) => ({
    ...task,
    id: index,
    statusId: statuses[0]?.id || 1,
    authorId: users[0]?.id || 1,
    executorId: users[1]?.id || 1,
  }));

  return {
    new: {
      ...generateData('task', 1)[0],
      statusId: statuses[0]?.id || 1,
      authorId: users[0]?.id || 1,
      executorId: users[1]?.id || 1,
    },
    existing: {
      update: tasks[0],
      delete: tasks[1],
    },
    seeds: tasks,
  };
};
