// Note to myself: Don`t forget to roll migrations back and update them !!
export const up = (knex) =>
  knex.schema.createTable("labels", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

export const down = (knex) => knex.schema.dropTableIfExists("labels");
