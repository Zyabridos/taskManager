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
  })
};

export const generateData = (type, length = 3) => {
  const data = [];
  const generator = generators[type];

  Array.from({ length }).forEach(() => {
    data.push(generator());
  });

  return data;
};

export const generateUsers = () => {
  const newUser = generateData('user', 1);
  const users = generateData('user', 3);
  const seeds = users.map((user) => ({
    ..._.omit(user, 'password'),
    passwordDigest: encrypt(user.password),
  }));
  return {
    new: newUser[0],
    existing: {
      author: users[0],
      executor: users[1],
      delete: users[2],
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