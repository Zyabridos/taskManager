import bcrypt from 'bcrypt';

export default async function sessionsRoutes(app, opts) {
  const { db } = opts; // Получаем базу данных из опций

  // Главная страница с отображением flash-сообщений
  app.get('/', async (req, res) => {
    const { t } = req;
    // const flashMessages = req.flash();
    // console.log('Flash messages:', flashMessages);
    // console.log('Flash success messages:', req.flash('success'));
    // console.log('Flash warning messages:', req.flash('warning'));

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
      // flash: flashMessages,
    });
  });

  // Страница входа
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

  // Обработка входа
  app.post('/session', async (req, res) => {
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
        // req.flash('warning', 'Пользователь не найден!');
        return res.redirect('/session/new'); // Перенаправляем на страницу входа
      }

      const passwordMatches = await bcrypt.compare(password, user.password);

      if (!passwordMatches) {
        console.log('Пароли не совпадают:', { email, password });
        // req.flash('warning', 'Неверный пароль!');
        return res.redirect('/session/new'); // Перенаправляем на страницу входа
      }

      console.log('Вы успешно авторизовались:', { userId: user.id });
      // req.flash('success', 'Вы успешно вошли в систему!');
      req.session.userId = user.id;
      res.redirect('/'); // Перенаправляем на главную страницу
    } catch (err) {
      console.error('Ошибка при выполнении запроса:', err);
      res.status(500).send('Внутренняя ошибка сервера');
    }
  });

  // Обработка выхода
  app.post('/session/delete', (req, res) => {
    console.log('Обработчик маршрута /sessions/delete вызван');
    if (!req.session) {
      // req.flash('warning', 'Сессия не найдена!');
      return res.redirect('/'); // Перенаправляем на главную страницу
    }

    req.session = null; // Удаляем данные сессии
    // req.flash('success', 'Вы вышли из системы!');
    console.log('Сессия удалена');
    res.redirect('/'); // Перенаправляем на главную страницу
  });
}
