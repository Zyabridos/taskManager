import bcrypt from 'bcrypt';
import routes from './routes.js'

export default async function sessionsRoutes(app, opts) {
  const { db } = opts; // Получаем базу данных из опций

  // Главная страница с отображением flash-сообщений
  app.get('/', { name: 'home' }, async (req, res) => {
    // app.get('/', async (req, res) => {
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
  app.get('/session/new', { name: 'sessionNew' }, (req, res) => {
    // app.get('/session/new', (req, res) => {
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
  // app.post('/session', { name: 'sessionCreate' }, async (req, res) => {
    app.post('/session', async (req, res) => {
    const { email, password } = req.body;
    // console.log('Request body:', req.body);

    try {
      const user = await new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
          if (err) return reject(err);
          resolve(row);
        });
      });

      if (!user) {
        console.log('Пользователь не найден:', email);
        // return res.redirect(app.reverse('sessionNew')); // позже подставим имя маршрута (sessionCreate)
        return res.redirect(routes.sessionCreate);
      }

      const passwordMatches = await bcrypt.compare(password, user.password);

      if (!passwordMatches) {
        console.log('Пароли не совпадают:', { email, password });
        // return res.redirect(app.reverse('sessionNew')); // позже подставим имя маршрута (sessionCreate)
        return res.redirect(routes.sessionCreate);
      }

      console.log('Вы успешно авторизовались:', { userId: user.id });
      req.session.userId = user.id;
      res.redirect(app.reverse('home'));
    } catch (err) {
      console.error('Ошибка при выполнении запроса:', err);
      res.status(500).send('Внутренняя ошибка сервера');
    }
  });

  // Обработка выхода
  app.post('/session/delete', { name: 'sessionDelete' }, (req, res) => {
    // app.post('/session/delete', (req, res) => {
    console.log('Обрабатываю /sessions/delete');
    if (!req.session) {
      // return res.redirect(app.reverse('root'));
      return res.redirect(routes.root);
    }

    req.session = null; // Удаляем данные сессии
    console.log('Сессия удалена');
    // res.redirect(app.reverse('root'));
    return res.redirect(routes.root);
  });
}
