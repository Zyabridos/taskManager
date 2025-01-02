import fastify from 'fastify';
import fastifyView from '@fastify/view';
import pug from 'pug';
import i18next from 'i18next';
import middleware from 'i18next-http-middleware';
import path from 'path';
import fastifyFormbody from '@fastify/formbody';
import userRoutes from './routes/users.js';
import en from './locales/en.js';
import ru from './locales/ru.js';
import sessionsRoutses from './routes/sessions.js'; 

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const PORT = process.env.PORT || 3000;

const app = fastify({ logger: true });

// Настройка i18next
i18next
  .use(middleware.LanguageDetector)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    resources: { en, ru },
  });

app.register(middleware.plugin, { i18next });
app.register(fastifyFormbody);

app.register(fastifyView, {
  engine: { pug },
});

// Подключение маршрутов пользователей
app.register(userRoutes);

app.register(sessionsRoutses);

// Запуск сервера
app.listen({
  port: PORT,        // Порт
  host: '0.0.0.0',   // Адрес
}, (err, address) => {
  if (err) {
    app.log.error(err);  // Логирование ошибки
    process.exit(1);     // Завершение процесса с ошибкой
  }
  app.log.info(`Server is running on ${address}`);
});