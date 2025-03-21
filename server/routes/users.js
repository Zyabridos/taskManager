/* eslint-disable consistent-return */
import i18next from 'i18next';

export default (app) => {
  app
    .get('/users', { name: 'users' }, async (req, reply) => {
      const users = await app.objection.models.user.query();
      reply.render('users/index', { users });
      return reply;
    })

    .get('/users/new', { name: 'newUser' }, (req, reply) => {
      const user = new app.objection.models.user();
      reply.render('users/new', { user });
    })

    .get('/users/:id/edit', { name: 'editUser' }, async (req, reply) => {
      const { id } = req.params;
      try {
        const user = await app.objection.models.user.query().findById(id);
        if (!user) {
          req.flash('error', i18next.t('flash.users.edit.notFound'));
          reply.status(404).send('User not found');
          return;
        }
        reply.render('users/edit', { user, errors: {} });
      } catch ({ data }) {
        reply.render('users/edit', { errors: data });
        req.flash('error', i18next.t('flash.users.edit.error'));
        reply.status(500).send('Internal Server Error');
      }
      return reply;
    })

    .post('/users', { name: 'users' }, async (req, reply) => {
      const user = new app.objection.models.user();

      try {
        const validUser = await app.objection.models.user.fromJson(
          req.body.data
        );
        await app.objection.models.user.query().insert(validUser);

        const message = i18next.t('flash.users.create.success');
        req.flash('info', message);

        reply.status(302).redirect('/');
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.render('users/new', { user, errors: data });
      }

      return reply;
    })

    .patch('/users/:id', { name: 'editUser' }, async (req, reply) => {
      const { id } = req.params;
      const updatedData = req.body.data;
      try {
        const user = await app.objection.models.user.query().findById(id);
        if (!user) {
          req.flash('error', i18next.t('flash.users.edit.notFound'));
          return reply.redirect('/users');
        }
        await user.$query().patch(updatedData);
        req.flash('info', i18next.t('flash.users.edit.success'));
        reply.redirect('/users');
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.edit.error'));
        return reply.render('users/edit', {
          user: { id, ...updatedData },
          errors: data,
        });
      }
    })

    .delete('/users/:id', { name: 'deleteUser' }, async (req, reply) => {
      const { id } = req.params;

      try {
        const user = await app.objection.models.user.query().findById(id);
        if (!user) {
          req.flash('error', i18next.t('flash.users.delete.notFound'));
          return reply.status(404).send('User not found');
        }

        const hasTasks = await app.objection.models.task
          .query()
          .where('authorId', id)
          .orWhere('executorId', id)
          .resultSize();

        if (hasTasks > 0) {
          req.flash('error', i18next.t('flash.users.delete.hasTasks'));
          return reply.redirect('/users');
        }

        if (req.session.userId === user.id) {
          await req.logOut();
          req.session.userId = null;
        }

        await user.$query().delete();
        req.flash('info', i18next.t('flash.users.delete.success'));
        return reply.redirect('/users');
      } catch (error) {
        req.flash('error', i18next.t('flash.users.delete.error'));
        return reply.redirect('/users');
      }
    });
};
