const createBasicTable = (knex, tableName) =>
  knex.schema.createTable(tableName, (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

export default createBasicTable;
