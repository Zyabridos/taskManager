export default (db) => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        firstName VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        created_at_local_time timestamp NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
  });

  return db;
};
