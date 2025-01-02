import userValidationSchema from '../validationSchemas/userValidationSchema.js';

const routes = {
  // list of all users
  usersPath: '/users',
  // particular user
  userPath: (id) => `/users/${id}`,
  // edit user
  editUserPath: (id) => `/users/${id}/edit`,
  // create new user
  newUserPath: '/users/new',
};

const users = []; // Хранилище пользователей

export default async function userRoutes(app, opts) {
  // GET /users/new - форма регистрации
  app.get('/users/new', (req, res) => {
    const { t } = req; // Функция перевода
    return res.view('./server/views/users/new.pug', {
      views: {
        users: {
          navBar: {
            taskManager: t('Менеджер задач'),
            users: t('Пользователи'),
            signIn: t('Вход'),
            createAccount: t('Регистрация'),
          },
          new: {
            title: t('Регистрация'),
            firstName: t('Имя'),
            lastName: t('Фамилия'),
            email: t('Email'),
            password: t('Пароль'),
            submit: t('Зарегистрироваться'),
            firstNamePlaceholder: t('Введите ваше имя'),
            lastNamePlaceholder: t('Введите вашу фамилию'),
            emailPlaceholder: t('Введите ваш email'),
            passwordPlaceholder: t('Введите ваш пароль'),
          },
        },
        messages: {},
      },
    });
  });

  // POST /users - обработка данных формы регистрации
  app.post('/users', async (req, res) => {
    const formData = req.body;

  // Преобразуем данные в объект
  const data = {
    firstName: formData['data[firstName]'],
    lastName: formData['data[lastName]'],
    email: formData['data[email]'],
    password: formData['data[password]'],
  };

  console.log('Received data:', data);

    if (!data) {
      return res.send('Данные не найдены.');
    }

    try {
      // Валидация данных
      await userValidationSchema.validate(data, { abortEarly: false });

      // Добавление нового пользователя
      const newUser = {
        id: users.length + 1, // Генерируем ID - так делать не надо, но пока сойдет
        ...data,
        createdAt: new Date().toISOString(), // Добавляем дату регистрации
      };
      users.push(newUser);

      // Перенаправление на список пользователей
      return res.redirect('/users');
    } catch (error) {
      // Обработка ошибок валидации
      const messages = error.inner.map((e) => e.message); // Формируем массив ошибок
      const { t } = req;

      return res.view('./server/views/users/new.pug', {
        views: {
          users: {
            navBar: {
              taskManager: t('Менеджер задач'),
              users: t('Пользователи'),
              signIn: t('Вход'),
              createAccount: t('Регистрация'),
            },
            new: {
              title: t('Регистрация'),
              firstName: t('Имя'),
              lastName: t('Фамилия'),
              email: t('Email'),
              password: t('Пароль'),
              submit: t('Зарегистрироваться'),
              firstNamePlaceholder: t('Введите ваше имя'),
              lastNamePlaceholder: t('Введите вашу фамилию'),
              emailPlaceholder: t('Введите ваш email'),
              passwordPlaceholder: t('Введите ваш пароль'),
            },
          },
        },
        messages: { error: messages },
      });
    }
  });

  // GET /users - список пользователей
  app.get('/users', (req, res) => {
    const { t } = req; // Функция перевода
    return res.view('./server/views/users/index.pug', {
      views: {
        users: {
          title: t('Пользователи'),
          taskManager: t('Менеджер задач'),
          navBar: {
            users: t('Пользователи'),
            signIn: t('Вход'),
            createAccount: t('Регистрация'),
          },
          table: {
            title: t('Список пользователей'),
            id: t('ID'),
            fullName: t('Полное имя'),
            email: t('Email'),
            createdAt: t('Дата создания'),
            actions: t('Действия'),
          },
        },
      },
      users, // Передаем список пользователей
    });
  });
}


