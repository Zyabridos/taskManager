export const up = async (knex) => {
  await knex.schema.createTable('task_labels', (table) => {
    table.increments('id').primary();
    table.integer('task_id').notNullable().references('id').inTable('tasks').onDelete('CASCADE');
    table.integer('label_id').notNullable().references('id').inTable('labels').onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

export const down = async (knex) => {
  await knex.schema.dropTableIfExists('task_labels');
};
