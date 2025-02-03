// Note to myself: Don`t forget to roll migrations back and update them !!
export const up = async (knex) => {
  await knex.schema.createTable('tasks', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('description');
    table
      .integer('status_id')
      .references('id')
      .inTable('statuses')
      .notNullable()
      .onDelete('CASCADE');
    table
      .integer('author_id')
      .references('id')
      .inTable('users')
      .notNullable()
      .onDelete('CASCADE');
    table
      .integer('executor_id')
      .references('id')
      .inTable('users')
      .notNullable()
      .onDelete('SET NULL');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('task_labels', (table) => {
    table.increments('id').primary();
    table
      .integer('task_id')
      .references('id')
      .inTable('tasks')
      .notNullable()
      .onDelete('CASCADE');
    table
      .integer('label_id')
      .references('id')
      .inTable('labels')
      .notNullable()
      .onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

export const down = async (knex) => {
  await knex.schema.dropTable('task_labels');
  await knex.schema.dropTable('tasks');
};
