export default {
  translation: {
    appName: 'Менеджер задач',
    flash: {
      session: {
        create: {
          success: 'Вы залогинены',
          error: 'Неправильный емейл или пароль',
        },
        delete: {
          success: 'Вы разлогинены',
        },
      },
      users: {
        create: {
          error: 'Не удалось зарегистрировать',
          success: 'Пользователь успешно зарегистрирован',
        },
      },
      authError: 'Доступ запрещён! Пожалуйста, авторизируйтесь.',
    },
    layouts: {
      application: {
        users: 'Пользователи',
        statuses: 'Статусы',
        signIn: 'Вход',
        signUp: 'Регистрация',
        signOut: 'Выход',
      },
    },
    views: {
      session: {
        new: {
          signIn: 'Вход',
          submit: 'Войти',
        },
      },
      users: {
        id: 'ID',
        email: 'Email',
        createdAt: 'Дата создания',
        actions: 'Действия',
        editBtn: 'Изменить',
        delete: 'Удалить',
        new: {
          submit: 'Сохранить',
          signUp: 'Регистрация',
        },
        edit: {
          title: 'Редактировать пользователя',
          firstName: 'Имя',
          lastName: 'Фамилия',
          email: 'Email',
          submit: 'Сохранить изменения',
        },
      },
      statuses: {
        title: 'Статусы',
        createStatusBtn: 'Создать статус',
        id: 'ID',
        name: 'Наименование',
        createdAt: 'Дата создания',
        actions: 'Действия',
        editBtn: 'Изменить',
        delete: 'Удалить',
        statusForm: {
          name: 'Наименование'
        },
        new: {
          title: 'Создать статус',
          submit: 'Создать'
        },
        edit: {
          title: 'Изменить статус',
          submit: 'Изменить'
        }
      },
      welcome: {
        index: {
          hello: 'Привет от Нины!',
          description: 'Практический проект на Fastify',
          more: 'Узнать Больше',
        },
      },
    },
  },
};
