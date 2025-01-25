import i18next from 'i18next';


export default (app) => {
  app
    // Маршрут для просмотра списка пользователей
    .get('/users', { name: 'users' }, async (req, reply) => {
      const users = await app.objection.models.user.query();
      reply.render('users/index', { users });
      return reply;
    })
    // Страница регистрации
    .get('/users/new', { name: 'newUser' }, (req, reply) => {
      const user = new app.objection.models.user();
      reply.render('users/new', { user });
    })
    // Создание пользователя
    .post('/users', async (req, reply) => {
      const user = new app.objection.models.user();
      user.$set(req.body.data);

      try {
        const validUser = await app.objection.models.user.fromJson(req.body.data);
        await app.objection.models.user.query().insert(validUser);
        // req.flash('info', i18next.t('flash.users.create.success'));
        console.log('User created successfully, redirecting...');
        reply.redirect('/');
      } catch (error) {
        // req.flash('error', i18next.t('flash.users.create.error'));
        console.error('Error during user creation:', error);
        reply.render('users/new', { user, errors: error.data || {} });
      }
      return reply;
    })
    // Маршрут для получения страницы редактирования пользователя
  .get('/users/:id/edit', { name: 'editUser' }, async (req, reply) => {
    try {
      const user = await app.objection.models.user.query().findById(req.params.id);

      if (!user) {
        return reply.notFound();
      }

      // return reply.render('users/edit', { user });
      await reply.view('users/edit', { user });
    } catch (error) {
      console.error('Error fetching user:', error);
      return reply.redirect('/users');
    }
  })

    // Маршрут для обновления пользователя (PATCH)
    .patch('/users/:id', async (req, reply) => {
      try {
        const user = await app.objection.models.user.query().findById(req.params.id);
        if (!user) {
          reply.notFound();
        }
        await user.$query().patch(req.body.data);
        console.log('User updated successfully, redirecting...');
        return reply.redirect('/users');
      } catch (error) {
        console.error('Error updating user:', error);
        return reply.render('users/edit', { errors: error.data || {} });
      }
    });
};
