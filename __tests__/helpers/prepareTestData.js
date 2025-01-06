import { faker } from '@faker-js/faker';

export default async function prepareTestData(db) {
  // Create the `users` table
  await db.exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TEXT,
      created_at_local_time TEXT
    );
  `);

  // Insert mock users
  const insertUser = `
    INSERT INTO users (firstName, lastName, email, password, created_at, created_at_local_time)
    VALUES (?, ?, ?, ?, ?, ?);
  `;

  const fakeUsers = Array.from({ length: 5 }).map(() => [
    faker.internet.username(),
    faker.internet.username(),
    faker.internet.email(),
    faker.internet.password(8),
    new Date().toUTCString(),
    new Date().toLocaleString(),
  ]);

  for (const user of fakeUsers) {
    await db.run(insertUser, user);
  }
}