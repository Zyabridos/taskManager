export default async function sessionsRoutes(app, opts) {
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
  // Страница входа (GET /session/new)
  app.get('/session/new', (req, res) => {
    const { t } = req; // Функция перевода

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
}
