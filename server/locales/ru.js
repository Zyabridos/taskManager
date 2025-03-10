import { generateLocaleRuFlashMessages } from "../utils.js";

export default {
  translation: {
    appName: "Менеджер задач",
    flash: {
      labels: {
        ...generateLocaleRuFlashMessages("Метка"),
        delete: {
          ...generateLocaleRuFlashMessages("Метка").delete,
          hasTasks: "Эта метка прикреплена к задаче, поэтому её нельзя удалить",
        },
      },
      tasks: {
        ...generateLocaleRuFlashMessages("Задача"),
        delete: {
          ...generateLocaleRuFlashMessages("Задача").delete,
          noAccess: "Задачу может удалить только ее автор",
        },
      },
      statuses: {
        ...generateLocaleRuFlashMessages("Статус"),
        delete: {
          ...generateLocaleRuFlashMessages("Статус").delete,
          hasTasks:
            "Этот статус прикреплен к задаче, поэтому его нельзя удалить",
        },
      },
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
        ...generateLocaleRuFlashMessages("Пользователь"),
        delete: {
          ...generateLocaleRuFlashMessages("Пользователь").delete,
          noAccess:
            "Вы не можете редактировать или удалять другого пользователя",
          hasTasks:
            "У этого пользователя есть задача, поэтому его нельзя удалить",
        },
        edit: {
          noAcess:
            "Вы не можете редактировать или удалять другого пользователя",
          success: "Пользователь успешно изменён",
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
        language: "Изменить язык",
      },
      english: "English",
      russian: "Русский",
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
          submit: "Изменить",
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
          label: "Наименование",
        },
        edit: {
          title: "Изменить статус",
          submit: "Наименование",
          label: "Наименование",
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
          title: "Создать метку",
          submit: "Создать",
          label: "Создать метку",
        },
        edit: {
          title: "Изменить метку",
          submit: "Изменить",
          label: "Изменить метку",
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
