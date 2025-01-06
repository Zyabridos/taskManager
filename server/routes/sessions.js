import bcrypt from 'bcrypt';

export default async function sessionsRoutes(app, opts) {
  const { db } = opts; // Получаем базу данных из опций

  app.get('/', async (req, res) => {
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
              'Добро пожаловать в менеджер задач - практический проект на Fastufy'
            ),
            button: t('Узнать больше'),
          },
        },
      },
    });
  });

  app.get('/session/new', (req, res) => {
    const { t } = req;

    return res.view('./server/views/sessions/new.pug', {
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

  app.post('/sessions', async (req, res) => {
    const { email, password } = req.body;
    console.log('Request body:', req.body);

    try {
      const user = await new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
          if (err) return reject(err);
          resolve(row);
        });
      });

      if (!user) {
        console.log('Пользователь не найден:', email);
        const { t } = req;
        return res
          .status(401)
          .view('./server/views/sessions/new.pug', {
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
                  invalidCredentials: t('Неверный email или пароль.'),
                  missingFields: t('Пожалуйста, заполните все поля.'),
                },
              },
            },
            error: t('Неверное имя пользователя или пароль'),
          });
      }

      const passwordMatches = await bcrypt.compare(password, user.password);

      if (!passwordMatches) {
        console.log('Пароли не совпадают:', { email, password });
        const { t } = req;
        return res
          .status(401)
          .view('./server/views/sessions/new.pug', {
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
                  invalidCredentials: t('Неверный email или пароль.'),
                  missingFields: t('Пожалуйста, заполните все поля.'),
                },
              },
            },
            error: t('Неверное имя пользователя или пароль'),
          });
      }

      console.log('Вы успешно авторизовались:', { userId: user.id });
      req.session.userId = user.id;
      res.redirect('/');
    } catch (err) {
      console.error('Ошибка при выполнении запроса:', err);
      res.status(500).send('Внутренняя ошибка сервера');
    }
  });

  app.post('/sessions/delete', (req, res) => {
  if (!req.session) {
    console.log('Сессия не найдена');
    return res.status(400).send('Сессия не найдена');
  }

  // Удаляем данные сессии
  req.session = null;

  console.log('Сессия удалена');
  res.redirect('/');
});
}