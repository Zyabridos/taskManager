export default async function sessionsRoutes(app, opts) {
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
    
  }
    });
  });
}

