import fastify from 'fastify';
import fastifyView from '@fastify/view';
import fastifyStatic from '@fastify/static';
import pug from 'pug';
import i18next from 'i18next';
import middleware from 'i18next-http-middleware';
import path from 'path';
import fastifyFormbody from '@fastify/formbody';
import fastifyCookie from '@fastify/cookie';
import userRoutes from './routes/users.js';
import en from './locales/en.js';
import ru from './locales/ru.js';
import sessionsRoutses from './routes/sessions.js';
import changeLanguage from './routes/index.js';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const PORT = process.env.PORT || 3000;

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
app.register(fastifyCookie);  // Регистрируем плагин для cookies

// Регистрируем статичные файлы
app.register(fastifyStatic, {
  root: path.join(__dirname, 'styles'),
  prefix: '/styles/',
});

app.register(fastifyView, {
  engine: { pug },
});

// Регистрируем маршруты
app.register(userRoutes);
app.register(sessionsRoutses);
app.register(changeLanguage);

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
