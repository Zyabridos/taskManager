import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Миграции — это файлы, которые описывают изменения структуры базы данных (создание таблиц, их удаление, модификация итд)
const migrations = {
  // путь до миграций
  directory: path.join(__dirname, "server", "migrations"),
};

export const development = {
  // какую БД использовать как клиент
  client: "sqlite3",
  // которая находится по пути
  connection: {
    filename: path.resolve(__dirname, "database.sqlite"),
  },
  useNullAsDefault: true,
  // путь к миграциям
  migrations,
};

export const test = {
  client: "sqlite3",
  // :memory: БД создаётся в памяти и существует только во время выполнения тестов. Это позволяет изолировать тесты.
  connection: ":memory:",
  useNullAsDefault: true,
  debug: true,
  migrations,
};

// почти идентично development, но используется для рабочей версии приложения.
export const production = {
  client: "sqlite3",
  connection: {
    filename: path.resolve(__dirname, "database.sqlite"),
  },
  useNullAsDefault: true,
  migrations,
};

// не забываем выполнить команду для создания таблиц npx knex migrate:latest
