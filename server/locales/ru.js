export default {
  translation: {
    appName: "Менеджер задач",
    flash: {
      session: {
        create: {
          success: "Вы залогинены",
          error: "Неправильный емейл или пароль",
        },
        delete: {
          success: "Вы разлогинены",
        },
      },
      users: {
        create: {
          error: "Не удалось зарегистрировать",
          success: "Пользователь успешно зарегистрирован",
        },
        delete: {
          success: "Пользователь успешно удален",
          error: "Ошибка при удалении пользователя.",
          notFound: "Пользователь не найдена.",
          hasTasks:
            "Нельзя удалить пользователя, так как он является исполнителем задачи",
        },
      },
      statuses: {
        create: {
          error: "Не удалось создать статус",
          success: "Статус успешно создан",
        },
        delete: {
          success: "Статус успешно удален!",
          error: "Ошибка при удалении статуса.",
          notFound: "Статус не найден.",
        },
      },
      tasks: {
        create: {
          error: "Не удалось создать задачу",
          success: "Задача успешно создана",
        },
        delete: {
          success: "Задача успешно удалена!",
          error: "Ошибка при удалении задачи.",
          notFound: "Задача не найдена.",
        },
      },
      labels: {
        create: {
          error: "Не удалось создать метку",
          success: "Метка успешно создана",
        },
        delete: {
          success: "Метка успешно удалена!",
          error: "Ошибка при удалении метки.",
          notFound: "Метка не найдена.",
          hasTasks: "Нельзя удалить метку, так как она используется в задачах.",
        },
      },
      authError: "Доступ запрещён! Пожалуйста, авторизируйтесь.",
    },
    layouts: {
      application: {
        users: "Пользователи",
        statuses: "Статусы",
        tasks: "Задачи",
        labels: "Метки",
        signIn: "Вход",
        signUp: "Регистрация",
        signOut: "Выход",
      },
    },
    views: {
      session: {
        new: {
          signIn: "Вход",
          submit: "Войти",
          email: "Email",
          password: "Пароль",
        },
      },
      users: {
        title: "Пользователи",
        id: "ID",
        fullName: "Полное имя",
        email: "Email",
        createdAt: "Дата создания",
        actions: "Действия",
        editBtn: "Изменить",
        delete: "Удалить",
        firstName: "Имя",
        lastName: "Фамилия",
        password: "Пароль",
        new: {
          header: "Регистрация",
          submit: "Сохранить",
          signUp: "Регистрация",
        },
        edit: {
          title: "Редактировать пользователя",
          submit: "Сохранить изменения",
        },
      },
      statuses: {
        title: "Статусы",
        createStatusBtn: "Создать статус",
        id: "ID",
        name: "Наименование",
        createdAt: "Дата создания",
        actions: "Действия",
        editBtn: "Изменить",
        delete: "Удалить",
        statusForm: {
          name: "Наименование",
        },
        new: {
          title: "Создать статус",
          submit: "Создать",
        },
        edit: {
          title: "Изменить статус",
          submit: "Изменить",
        },
      },
      tasks: {
        title: "Задачи",
        createTaskBtn: "Создать задачу",
        id: "ID",
        name: "Наименование",
        status: "Статус",
        author: "Автор",
        executor: "Исполнитель",
        createdAt: "Дата создания",
        actions: "Действия",
        editBtn: "Изменить",
        delete: "Удалить",
        label: "Метка",
        labels: "Метки",
        description: "Описание",
        filter: "Показать",
        tasksForm: {
          name: "Наименование",
        },
        isUserCreator: "Только мои задачи",
        noExecutors:
          "Список пользователей пуст, поэтому некому исполнить эту задачу :)",
        new: {
          title: "Создать задачу",
          submit: "Создать",
        },
        edit: {
          title: "Изменить задачу",
          submit: "Изменить",
        },
      },
      labels: {
        title: "Метки",
        createLabelBtn: "Создать метку",
        id: "ID",
        name: "Наименование",
        createdAt: "Дата создания",
        actions: "Действия",
        editBtn: "Изменить",
        delete: "Удалить",
        new: {
          title: "Создать статус",
          submit: "Создать",
        },
        edit: {
          title: "Изменить статус",
          submit: "Изменить",
        },
      },
      welcome: {
        index: {
          hello: "Привет от Нины!",
          description: "Практический проект на Fastify",
          more: "Узнать Больше",
        },
      },
    },
    errors: {
      wrongEmailOrPassword: "Неправильный емейл или пароль",
    },
  },
};
