import { createBasicTable } from "../utils.js";

export const up = (knex) => createBasicTable(knex, "labels");

export const down = (knex) => knex.schema.dropTable("labels");
