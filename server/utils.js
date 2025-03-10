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

export const generateLocaleFlashMessages = (entityName, locale = "en") => {
  const messages = {
    en: {
      create: {
        success: `${entityName} successfully created`,
        error: `Failed to create ${entityName}`,
      },
      update: {
        success: `${entityName} successfully updated`,
        error: `Failed to update ${entityName}`,
      },
      delete: {
        success: `${entityName} successfully deleted`,
        error: `Failed to delete ${entityName}`,
      },
    },
    ru: {
      create: {
        success: `${entityName} успешно создан`,
        error: `Не удалось создать ${entityName}`,
      },
      update: {
        success: `${entityName} успешно обновлен`,
        error: `Не удалось обновить ${entityName}`,
      },
      delete: {
        success: `${entityName} успешно удален`,
        error: `Не удалось удалить ${entityName}`,
      },
    },
  };

  return messages[locale] || messages.en;
};
