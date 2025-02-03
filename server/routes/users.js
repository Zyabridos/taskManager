import i18next from 'i18next';

export default (app) => {
  app
    // GET /users - list of all users
    .get('/users', { name: 'users' }, async (req, reply) => {
      const users = await app.objection.models.user.query();
      reply.render('users/index', { users });
      return reply;
    })

    // GET /users/new - get page for user creation
    .get('/users/new', { name: 'newUser' }, (req, reply) => {
      const user = new app.objection.models.user();
      reply.render('users/new', { user });
    })

    // GET /users/:id/edit - page for editing user
    .get('/users/:id/edit', { name: 'editUser' }, async (req, reply) => {
      const { id } = req.params;
      try {
        const user = await app.objection.models.user.query().findById(id);
        if (!user) {
          req.flash('error', i18next.t('flash.users.edit.notFound'));
          reply.status(404).send('User not found');
          return;
        }
        console.log('User data:', user); //
        reply.render('users/edit', { user, errors: {} });
      } catch ({ data }) {
        reply.render('users/edit', { errors: data });
        req.flash('error', i18next.t('flash.users.edit.error'));
        reply.status(500).send('Internal Server Error');
      }
      return reply;
    })

    // POST /users - send data for user creation
    .post('/users', async (req, reply) => {
      const user = new app.objection.models.user();

      try {
        const validUser = await app.objection.models.user.fromJson(
          req.body.data
        );
        await app.objection.models.user.query().insert(validUser);

        const message = i18next.t('flash.users.create.success');
        console.log('Flash message:', message);
        req.flash('info', message);

        reply.redirect(app.reverse('root'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.render('users/new', { user, errors: data });
      }

      return reply;
    })

    // PATCH /users/:id - update user
    .patch('/users/:id', async (req, reply) => {
      const { id } = req.params;
      const updatedData = req.body.data;
      try {
        const user = await app.objection.models.user.query().findById(id);
        if (!user) {
          req.flash('error', i18next.t('flash.users.edit.notFound'));
          return reply.status(404).send('User not found');
        }
        await user.$query().patch(updatedData);
        req.flash('info', i18next.t('flash.users.edit.success'));
        reply.redirect(`/users`);
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.edit.error'));
        reply.render('users/edit', {
          user: { id, ...updatedData },
          errors: data,
        });
      }
    })

    // DELETE /users/:id - delete user
    .delete('/users/:id', async (req, reply) => {
      const { id } = req.params;
      try {
        const user = await app.objection.models.user.query().findById(id);
        if (!user) {
          req.flash('error', i18next.t('flash.users.delete.notFound'));
          return reply.status(404).send('User not found');
        }
        await user.$query().delete();
        req.flash('info', i18next.t('flash.users.delete.success'));
        reply.redirect('/users');
      } catch (error) {
        req.flash('error', i18next.t('flash.users.delete.error'));
        return reply.status(500).send('Internal Server Error');
      }
    });
};
