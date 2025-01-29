// Note to myself: Don`t forget to roll migrations back and update them !!
export const up = (knex) =>
  knex.schema.createTable('tasks', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('description');
    table
      .integer('statusId') // id of a status that is connected to task
      .references('id')
      .inTable('statuses')
      .notNullable()
      .onDelete('CASCADE');
    table
      .integer('authorId') // id of a task author (the person that has created task while was logged in)
      .references('id')
      .inTable('users')
      // .notNullable()
      .onDelete('CASCADE');
    table
      .integer('executorId') // id of a person that an author set as an executor of the task
      .references('id')
      .inTable('users')
      .notNullable()
      .onDelete('SET NULL');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

export const down = (knex) => knex.schema.dropTable('tasks');
