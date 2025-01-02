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

const __dirname = path.dirname(new URL(import.meta.url).pathname);

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

app.listen({ port: 3000 }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info('Server is running on http://localhost:3000');
});
