import { faker } from '@faker-js/faker';

export const getTestData = () => ({
  users: {
    new: {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    },
    existing: {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    },
    update: {
      oldEmail: 'arya_stark@example.com', // уже существующий пользователь
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(), // Новый email
    },
    delete: {
      first_name: 'John',
      last_name: 'Snow',
      email: 'john_snow@example.com',
      password_digest: faker.string.alphanumeric(32),
    },
  },
});

export const prepareData = async (app) => {
  const { knex } = app.objection;

  // создаст массив из 5 пользователей
  const users = Array.from({ length: 5 }, () => ({
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    // создаст строку из 32 случайных букв и цифр
    password_digest: faker.string.alphanumeric(32),
  }));

  // добавляем пользователя, которого будем удалять
  users.push({
    first_name: 'John',
    last_name: 'Snow',
    email: 'john_snow@example.com',
    password_digest: faker.string.alphanumeric(32),
  });

  users.push({
    first_name: 'Arya',
    last_name: 'Stark',
    email: 'arya_stark@example.com',
    password_digest: faker.string.alphanumeric(32),
  });

  // говорим Knex.js работать с таблицей users в БД. (= INSERT INTO users)
  await knex('users').insert(users);
};
