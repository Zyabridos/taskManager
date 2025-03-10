export const prepareTaskViewData = async (app) => {
  const [statuses, users, labels] = await Promise.all([
    app.objection.models.status.query(),
    app.objection.models.user.query(),
    app.objection.models.label.query(),
  ]);

  return { statuses, users, labels };
};

export const createBasicTable = (knex, tableName) => 
  knex.schema.createTable(tableName, (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
