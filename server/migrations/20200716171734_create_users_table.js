export const up = (knex) =>
  knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('email').notNullable().unique();
    table.string('password_digest').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

export const down = (knex) => knex.schema.dropTable('users');

// при изменении миграций не забываем делать откат и потом обновлять
// # Откат всех миграций
// npx knex migrate:rollback --all

// # Применение миграций с обновленными полями
// npx knex migrate:latest
