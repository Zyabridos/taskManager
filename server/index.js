import fastify from 'fastify';
import fastifyView from 'point-of-view';
import fastifyStatic from '@fastify/static';
import pug from 'pug';
import i18next from 'i18next';
import middleware from 'i18next-http-middleware';
import path from 'path';
import fastifyFormbody from '@fastify/formbody';
import fastifyCookie from '@fastify/cookie';
import sqlite3 from 'sqlite3';
import session from '@fastify/session';
import userRoutes from './routes/users.js';
import en from './locales/en.js';
import ru from './locales/ru.js';
import sessionsRoutses from './routes/sessions.js';
import changeLanguage from './routes/index.js';
import prepareDatabase from './db/init.js';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const PORT = process.env.PORT || 3000;

const db = new sqlite3.Database(':memory:');
prepareDatabase(db);
const app = fastify({ logger: true });

// Настройка i18next с использованием cookies для сохранения языка
i18next.use(middleware.LanguageDetector).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: { en, ru },
  detection: {
    order: ['cookie', 'header'],
    caches: ['cookie'],
  },
});

app.register(middleware.plugin, { i18next });
app.register(fastifyFormbody);
app.register(fastifyCookie);
app.register(session, {
    secret: 'a secret with minimum length of 32 characters',
    cookie: {
      secure: false,
    },
  });

// хук для просмотра настроек текущей сессии
// app.addHook('preHandler', (req, res, done) => {
//   console.log('Текущая сессия:', req.session);
//   done();
// });

// Регистрируем статичные файлы
app.register(fastifyStatic, {
  root: path.join(__dirname, 'styles'),
  prefix: '/styles/',
});

app.register(fastifyView, {
  engine: { pug },
});

// Регистрируем маршруты
app.register(sessionsRoutses, { db });
app.register(changeLanguage);
// для пользователей передает БД как options
app.register(userRoutes, { db });

// Запуск сервера
app.listen(
  {
    port: PORT,
    host: '0.0.0.0',
  },
  (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    app.log.info(`Server is running on ${address}`);
  }
);