import bcrypt from 'bcrypt';
import routes from './routes.js';

export default async function sessionsRoutes(app, opts) {
  const { db } = opts; // Получаем базу данных из опций

  // Главная страница с отображением flash-сообщений
  app.get('/', { name: 'root' }, async (req, res) => {
    const { t } = req;

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
          changeLanguage: 'Changle language to English',
          welcomeCard: {
            title: t('Привет!'),
            message: t(
              'Добро пожаловать в менеджер задач - практический проект на Fastify'
            ),
            button: t('Узнать больше'),
          },
        },
      },
    });
  });
  // Страница входа
  app.get('/session/new', { name: 'sessionNew' }, (req, reply) => {
    const { t } = req;

    return reply.view('./server/views/sessions/new.pug', {
      views: {
        users: {
          title: t('Менеджер задач'),
          navBar: {
            createAccount: t('Регистрация'),
          },
        },
        login: {
          title: 'Вход',
          email: 'Электронная почта',
          password: 'Пароль',
          submit: 'Войти',
          error: {
            invalidCredentials: 'Неверный email или пароль.',
            missingFields: 'Пожалуйста, заполните все поля.',
          },
        },
      },
    });
  });

  // Обработка входа
  app.post('/session', { name: 'sessionCreate' }, async (req, reply) => {
    const { email, password } = req.body;
    console.log('Request body:', req.body);

    try {
      const user = await new Promise((replyolve, reject) => {
        db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
          if (err) return reject(err);
          replyolve(row);
        });
      });

      if (!user) {
        console.log('Пользователь не найден:', email);
        // return reply.redirect(app.reverse('sessionNew')); // позже подставим имя маршрута (sessionCreate)
        return reply.redirect(routes.sessionCreate);
      }

      const passwordMatches = await bcrypt.compare(password, user.password);

      if (!passwordMatches) {
        console.log('Пароли не совпадают:', { email, password });
        // return reply.redirect(app.reverse('sessionNew')); // позже подставим имя маршрута (sessionCreate)
        return reply.redirect(routes.sessionCreate);
      }

      console.log('Вы успешно авторизовались:', { userId: user.id });
      req.flash('info', 'SUCCESS'); // надо на 18n потом заменить
      req.session.userId = user.id;
      // reply.redirect(app.reverse('root'));
      reply.redirect(routes.root);
    } catch (err) {
      console.error('Ошибка при выполнении запроса:', err);
      reply.status(500).send('Внутренняя ошибка сервера');
    }
  });

  // Обработка выхода
  app.post('/session/delete', { name: 'sessionDelete' }, (req, reply) => {
    console.log('Обрабатываю /session/delete');
    if (!req.session) {
      // return reply.redirect(app.reverse('root'));
      return reply.redirect(routes.root);
    }

    req.session = null; // Удаляем данные сессии
    console.log('Сессия удалена');
    // reply.redirect(app.reverse('root'));
    return reply.redirect(routes.root);
  });
}
