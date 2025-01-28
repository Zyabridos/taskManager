export const up = (knex) =>
  knex.schema.createTable('statuses', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

export const down = (knex) => knex.schema.dropTable('users');

// при изменении миграций не забываем делать откат и потом обновлять
// # Откат всех миграций
// npx knex migrate:rollback --all

// # Применение миграций с обновленными полями
// npx knex migrate:latest
