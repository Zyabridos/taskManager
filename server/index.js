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
  .use(middleware.LanguageDetector) // Используем детектор языка
  .init({
    lng: 'en', // Язык по умолчанию
    fallbackLng: 'en', // Запасной язык
    resources: {
      en,
      ru,
    },
    // debug: true,
  });

app.register(middleware.plugin, { i18next });

app.register(fastifyView, {
  engine: { pug },
  // root: path.join(__dirname, '..', 'server', 'views'),
});

app.get('/', async (req, res) => {
  const t = req.t; 
  return res.view('./server/views/index.pug', {
    views: {
      mainPage: {
        title: t('Менеджер задач'),
        taskManager: t('Менеджер задач'),
        users: t('Пользователи'),
        status: t('Статусы'),
        labels: t('Метки'),
        tasks: t('Задачи'),
        exit: t('Выход'),
        welcomeCard: {
          title: t('Привет!'),
          message: t('Добро пожаловать в менеджер задач - практический проект на Fastufy'),
          button: t('Узнать больше'),
        }
      }
    }
  });
});

app.listen({ port: 3000 }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info('Server is running on http://localhost:3000');
});
