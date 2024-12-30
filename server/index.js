import fastify from 'fastify';
import fastifyView from '@fastify/view'; 
import pug from 'pug';
import i18next from 'i18next';
import middleware from 'i18next-http-middleware';
import path from 'path';
import en from './locales/en.js';
import ru from './locales/ru.js';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = fastify({ logger: true });

i18next
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    preload: ['en', 'ru'],
    resources: {
      en,
      ru
    }
  });

app.register(middleware.plugin, { i18next });

app.register(fastifyView, {
  engine: { pug },
});

// Роут для главной страницы с локализацией
app.get('/', async (req, res) => {
  const t = req.t; // функция перевода
  return res.view('./server/views/index.pug', {
    title: t('title'),
    message: t('message'),
  });
});

// Запуск сервера
app.listen({ port: 3000 }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info('Server is running on http://localhost:3000');
});
