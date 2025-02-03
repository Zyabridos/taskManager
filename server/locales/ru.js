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
        delete: {
          success: 'Пользователь успешно удален',
        },
      },
      statuses: {
        create: {
          error: 'Не удалось создать статус',
          success: 'Статус успешно создан',
        },
        delete: {
          success: 'Статус успешно удален',
        },
      },
      tasks: {
        create: {
          error: 'Не удалось создать задачу',
          success: 'Задача успешно создана',
        },
        delete: {
          success: 'Задача успешно удален',
        },
      },
      labels: {
        create: {
          error: 'Не удалось создать метку',
          success: 'Метка успешно создана',
        },
        delete: {
          success: 'Метка успешно удален',
        },
      },
      authError: 'Доступ запрещён! Пожалуйста, авторизируйтесь.',
    },
    layouts: {
      application: {
        users: 'Пользователи',
        statuses: 'Статусы',
        tasks: 'Задачи',
        labels: 'Метки',
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
          name: 'Наименование',
        },
        new: {
          title: 'Создать статус',
          submit: 'Создать',
        },
        edit: {
          title: 'Изменить статус',
          submit: 'Изменить',
        },
      },
      tasks: {
        title: 'Задачи',
        createStatusBtn: 'Создать задачу',
        id: 'ID',
        name: 'Наименование',
        status: 'Статус',
        author: 'Автор',
        executor: 'Исполнитель',
        createdAt: 'Дата создания',
        actions: 'Действия',
        editBtn: 'Изменить',
        delete: 'Удалить',
        labels: 'Метки',
        description: 'Описание',
        filter: 'Показать',
        tasksForm: {
          name: 'Наименование',
        },
        onlyMyTasks: 'Только мои задачи',
        noExecutors:
          'Список пользователей пуст, поэтому некому исполнить эту задачу :)',
        new: {
          title: 'Создать задачу',
          submit: 'Создать',
        },
        edit: {
          title: 'Изменить задачу',
          submit: 'Изменить',
        },
      },
      labels: {
        title: 'Метки',
        createLabelBtn: 'Создать метку',
        id: 'ID',
        name: 'Наименование',
        createdAt: 'Дата создания',
        actions: 'Действия',
        editBtn: 'Изменить',
        delete: 'Удалить',
        new: {
          title: 'Создать статус',
          submit: 'Создать',
        },
        edit: {
          title: 'Изменить статус',
          submit: 'Изменить',
        },
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
