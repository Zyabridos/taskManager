import bcrypt from 'bcrypt';
import { commonViewData, formViewData } from '../utils/viewData.js';
import userValidationSchema from '../validationSchemas/userValidationSchema.js';
import { formattedDate, formattedDateLocal } from '../utils/dateFormatters.js';

export default async function userRoutes(app, opts) {
  const { db } = opts; // Получаем базу данных из опций
  // GET /users - список всех пользователей
  app.get('/users', { name: 'usersList' }, async (req, res) => {
    const { t } = req;
    const flash = req.flash() || {};

    try {
      const users = await new Promise((resolve, reject) => {
        db.all('SELECT * FROM users', (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        });
      });
      console.log(users);
      return res.view('./server/views/users/index.pug', {
        views: {
          users: {
            title: t('Пользователи'),
            taskManager: t('Менеджер задач'),
            navBar: commonViewData(req, t).navBar,
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
        flash,
        data: { users: users || [] },
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  // GET /users/new - форма регистрации
  app.get('/users/new', { name: 'userNew' }, async (req, res) => {
    const { t } = req;
    return res.view('./server/views/users/new.pug', {
      views: formViewData(req, t, 'new'),
      messages: {},
    });
  });

  app.post('/users', { name: 'userCreate' }, async (req, reply) => {
    const formData = req.body;
    const flash = req.flash() || {};
    const user = {
      firstName: formData['data[firstName]'],
      lastName: formData['data[lastName]'],
      email: formData['data[email]'],
      password: formData['data[password]'],
    };

    try {
      // Валидация данных
      await userValidationSchema.validate(user, { abortEarly: false });
      const hashedPassword = await bcrypt.hash(user.password, 10);

      await new Promise((resolve, reject) => {
        const stmt = db.prepare(
          'INSERT INTO users (firstName, lastName, email, password, created_at, created_at_local_time) VALUES (?, ?, ?, ?, ?, ?)'
        );
        stmt.run(
          [
            user.firstName,
            user.lastName,
            user.email,
            hashedPassword,
            formattedDate,
            formattedDateLocal,
          ],
          (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          }
        );
        stmt.finalize();
      });

      req.flash('info', 'SUCCESS'); // Создаем flash-сообщение
      console.log('Сессия:', req.session);
      return reply.redirect('/');
    } catch (error) {
      const messages = error.inner?.map((e) => e.message) || [error.message];
      const { t } = req;

      req.flash('error', 'ERROR!'); // Создаем flash-сообщение для ошибок

      console.log('Flash для шаблона:', flash);

      return reply.view('./server/views/users/new.pug', {
        views: formViewData(req, t, 'new'),
        messages: { error: messages },
        flash, // Передаем flash-сообщения в шаблон
      });
    }
  });

  // GET /users/:id/edit - форма редактирования
  app.get('/users/:id/edit', { name: 'userEditForm' }, (req, res) => {
    const userId = req.params.id;
    const { t } = req;

    db.get('SELECT * FROM users WHERE id = ?', [userId], (err, user) => {
      if (err || !user) {
        res.status(404).send(t('Пользователь не найден'));
        return;
      }
      res.view('./server/views/users/edit.pug', {
        views: formViewData(req, t, 'edit'),
        user,
      });
    });
  });

  // PATCH /users/:id/edit - обновление пользователя
  app.patch('/users/:id/edit', { name: 'userUpdate' }, async (req, res) => {
    const userId = req.params.id;
    const formData = req.body;

    const updatedUser = {
      firstName: formData['data[firstName]'],
      lastName: formData['data[lastName]'],
      email: formData['data[email]'],
    };

    db.run(
      'UPDATE users SET firstName = ?, lastName = ?, email = ? WHERE id = ?',
      [updatedUser.firstName, updatedUser.lastName, updatedUser.email, userId],
      function (err) {
        if (err || this.changes === 0) {
          res.status(404).send('Пользователь не найден');
          return;
        }
        res.redirect(`/users/${userId}`);
      }
    );
  });

  // DELETE /users/:id - удаление пользователя
  app.delete('/users/:id', { name: 'userDelete' }, async (req, reply) => {
    const flash = req.flash() || {};
    const userId = req.params.id;

    try {
      const result = await db.run('DELETE FROM users WHERE id = ?', userId);

      if (result.changes === 0) {
        reply.status(404).send('Пользователь не найден');
        return;
      }

      flash('info', 'Пользователь успешно удален');
      return reply.redirect('/users');
    } catch (error) {
      req.flash('error', 'Ошибка при удалении пользователя');
      reply.status(500).send(error.message);
    }
  });
}
