export const up = (knex) =>
  knex.schema.createTable('tasks', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('description');
    table
      .integer('statusId')
      .references('id')
      .inTable('statuses')
      .notNullable()
      .onDelete('CASCADE');
    table
      .integer('creatorId')
      .references('id')
      .inTable('users')
      .notNullable()
      .onDelete('CASCADE');
    table
      .integer('executorId')
      .references('id')
      .inTable('users')
      .notNullable()
      .onDelete('SET NULL');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

export const down = (knex) => knex.schema.dropTable('tasks');
