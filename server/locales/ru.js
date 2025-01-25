export default {
  translation: {
    appName: 'Менеджер задач',
    layouts: {
      application: {
        users: 'Пользователи',
        signIn: 'Войти',
        signUp: 'Зарегистрироваться',
      },
    },
    views: {
      welcome: {
        index: {
          hello: 'Привет от Нины!',
          description: 'Добро пожаловать в мой проект на Fastify!',
          more: 'Узнать больше'
        },
      },
      login: {
        title: 'Авторизация',
        email: 'Электронная почта',
        password: 'Пароль',
        submit: 'Войти',
        error: {
          invalidCredentials: 'Неверный email или пароль.',
          missingFields: 'Пожалуйста, заполните все поля.',
        },
      },
      mainPage: {
        title: 'Менеджер задач',
        taskManager: 'Менеджер задач',
        users: 'Пользователи',
        status: 'Статусы',
        labels: 'Метки',
        tasks: 'Задачи',
        exit: 'Выход',
        changeLanguage: 'Сменить язык на английский',
        welcomeCard: {
          title: 'Привет!',
          message: 'Добро пожаловать в менеджер задач — практический проект на Fastify',
          button: 'Узнать больше',
        },
      },
      users: {
        title: 'Менеджер задач',
        navBar: {
          taskManager: 'Менеджер задач',
          users: 'Пользователи',
          signIn: 'Войти',
          createAccount: 'Регистрация',
        },
        table: {
          title: 'Пользователи',
          id: 'ID',
          fullName: 'Полное имя',
          email: 'Электронная почта',
          createdAt: 'Дата создания',
          actions: 'Действия',
        },
        new: {
          title: 'Регистрация',
          firstName: 'Имя',
          lastName: 'Фамилия',
          email: 'Электронная почта',
          password: 'Пароль',
          submit: 'Зарегистрироваться',
          firstNamePlaceholder: 'Введите ваше имя',
          lastNamePlaceholder: 'Введите вашу фамилию',
          emailPlaceholder: 'Введите ваш email',
          passwordPlaceholder: 'Введите ваш пароль',
        },
        edit: {
          title: 'Редактирование пользователя',
          firstName: 'Имя',
          lastName: 'Фамилия',
          email: 'Электронная почта',
          password: 'Пароль',
          submit: 'Сохранить изменения',
          firstNamePlaceholder: 'Введите ваше имя',
          lastNamePlaceholder: 'Введите вашу фамилию',
          emailPlaceholder: 'Введите ваш email',
          passwordPlaceholder: 'Введите новый пароль',
        },
      },
    },
    title: 'Главная страница',
    message: 'Добро пожаловать в наш сервис!',
  },
};
