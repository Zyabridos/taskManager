// @ts-check

// Это базовый класс из Objection.js, от которого наследуются все модели.
// Обеспечивает связь модели с таблицами базы данных, определение схемы JSON и другие функции.
const { Model } = require("objection");

module.exports = class BaseModel extends Model {
  // Указывает пути, где Objection.js может искать модели.
  static get modelPaths() {
    return [__dirname];
  }
};
