import { commonViewData, formViewData } from '../utils/viewData.js';
import userValidationSchema from '../validationSchemas/userValidationSchema.js';

const users = []; // Хранилище пользователей

export default async function userRoutes(app, opts) {
  // GET /users - list of users
  app.get('/users', (req, res) => {
    const { t } = req; // Функция перевода
    return res.view('./server/views/users/index.pug', {
      views: {
        users: {
          title: t('Пользователи'),
          taskManager: t('Менеджер задач'),
          navBar: commonViewData(req, t).navBar, // Use common navBar
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

  // GET /users/new - registration form
  app.get('/users/new', (req, res) => {
  const { t } = req; // Функция перевода
  return res.view('./server/views/users/new.pug', {
    views: formViewData(req, t, 'new'),
    messages: {},
  });
});

  // POST /users - process form data
  app.post('/users', async (req, res) => {
    const formData = req.body;

    const data = {
      firstName: formData['data[firstName]'],
      lastName: formData['data[lastName]'],
      email: formData['data[email]'],
      password: formData['data[password]'],
    };

    if (!data) {
      return res.send('Данные не найдены.');
    }

    try {
      // Валидация данных
      await userValidationSchema.validate(data, { abortEarly: false });

      const newUser = {
        id: users.length + 1, // Генерируем ID
        ...data,
        createdAt: new Date().toISOString(),
      };
      users.push(newUser);

      return res.redirect('/users');
    } catch (error) {
      const messages = error.inner.map((e) => e.message);
      const { t } = req;
      return res.view('./server/views/users/new.pug', {
        views: formViewData(req, t, 'new'),
        messages: { error: messages },
      });
    }
  });

  // GET /users/:id/edit - show edit form
  app.get('/users/:id/edit', (req, res) => {
    const userId = req.params.id;
    const { t } = req;

    const user = users.find(u => u.id === parseInt(userId, 10));

    if (user) {
      return res.view('./server/views/users/edit.pug', {
        views: formViewData(req, t, 'edit'),
        user, // Pass the user data to the view
      });
    }

    res.status(404).send('User not found');
  });

  // PATCH /users/:id/edit - update user
  app.patch('/users/:id/edit', (req, res) => {
    const userId = req.params.id;
    const formData = req.body;

    const data = {
      firstName: formData['data[firstName]'],
      lastName: formData['data[lastName]'],
      email: formData['data[email]'],
      password: formData['data[password]'],
    };

    const user = users.find(u => u.id === parseInt(userId, 10));
    if (user) {
      user.firstName = data.firstName;
      user.lastName = data.lastName;
      user.email = data.email;
      user.password = data.password || user.password; // Only update password if provided

      res.redirect(`/users/${user.id}`);
    } else {
      res.status(404).send('User not found');
    }
  });
}
