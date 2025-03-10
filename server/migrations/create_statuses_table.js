import { createBasicTable } from "../utils.js";

export const up = (knex) => createBasicTable(knex, "statuses");

export const down = (knex) => knex.schema.dropTable("statuses");
