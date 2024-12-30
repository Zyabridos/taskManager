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
        },
      },
    }
  });
});

app.get('/users', { name: 'users' }, (req, res) => {
  const t = req.t; 
  return res.view('./server/views/users/index.pug', {
    views: {
      users: {
        title: t('Менеджер задач'),
        taskManager: t('Менеджер задач'),
        navBar: {
          taskManager: t('Менеджер задач'),
          users: t('Пользователи'),
          signIn: t('Вход'),
          createAccount: t('Регистрация'),
        },
        table: {
          title: t('Пользователи'),
          id: t('ID'),
          fullName: t('Полное имя'),
          email: t('Email'),
          createdAt: t('Дата создания'),
          actions: t('Действия'),
        },
      }
    }
  });
});

app.get('/users/new', { name: 'newUser' }, (req, res) => {
  const t = req.t; 
  return res.view('./server/views/users/new.pug', {
    views: {
      users: {
        title: t('Менеджер задач'),
        taskManager: t('Менеджер задач'),
        navBar: {
          taskManager: t('Менеджер задач'),
          users: t('Пользователи'),
          signIn: t('Вход'),
          createAccount: t('Регистрация'),
        },
        new: {
          title: t('Регистрация'),
          firstName: t('Имя'),
          lastName: t('Фамилия'),
          email: t('Email'),
          password: t('Пароль'),
          submit: t('Зарегистрироваться'),
          firstNamePlaceholder: t('Введите ваше имя'),
          lastNamePlaceholder: t('Введите вашу фамилию'),
          emailPlaceholder: t('Введите ваш email'),
          passwordPlaceholder: t('Введите ваш пароль'),
    },
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
