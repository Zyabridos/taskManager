import i18next from 'i18next';

export default (app) => {
  app
    .get('/users', { name: 'users' }, async (req, reply) => {
      try {
        const users = await app.objection.models.user.query();
        reply.send({ users });
      } catch (error) {
        reply.code(500).send({ error: 'Failed to fetch users' });
      }
    });

  app.get('/users/new', { name: 'newUser' }, (req, reply) => {
    reply.send({ message: 'Render React component for user creation' });
  });

  app.post('/users', async (req, reply) => {
    try {
      const validUser = await app.objection.models.user.fromJson(req.body.data);
      await app.objection.models.user.query().insert(validUser);
      reply.send({ message: i18next.t('flash.users.create.success') });
    } catch (error) {
      reply.code(400).send({ error: i18next.t('flash.users.create.error'), details: error.data || {} });
    }
  });

  app.get('/users/:id/edit', { name: 'editUser' }, async (req, reply) => {
    try {
      const user = await app.objection.models.user.query().findById(req.params.id);
      if (!user) {
        return reply.code(404).send({ error: 'User not found' });
      }
      reply.send({ user });
    } catch (error) {
      reply.code(500).send({ error: 'Failed to fetch user' });
    }
  });

  app.patch('/users/:id', async (req, reply) => {
    try {
      const user = await app.objection.models.user.query().findById(req.params.id);
      if (!user) {
        return reply.code(404).send({ error: 'User not found' });
      }
      await user.$query().patch(req.body.data);
      reply.send({ message: 'User updated successfully' });
    } catch (error) {
      reply.code(400).send({ error: 'Failed to update user', details: error.data || {} });
    }
  });
};
