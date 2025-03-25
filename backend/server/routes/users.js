export default async (app) => {
  const { user: User, task: Task } = app.objection.models;

  app.get('/api/users', async (req, reply) => {
    const users = await User.query().select('id', 'firstName', 'lastName', 'email', 'createdAt');
    reply.send(users);
  });

  app.get('/api/users/:id', async (req, reply) => {
    const user = await User.query().findById(req.params.id);
    if (!user) return reply.status(404).send({ error: 'User not found' });
    reply.send(user);
  });

  app.post('/api/users', async (req, reply) => {
    try {
      const newUser = await User.query().insert(req.body);
      reply.code(201).send(newUser);
    } catch ({ data }) {
      reply.code(422).send({ error: 'Validation failed', errors: data });
    }
  });

  app.patch('/api/users/:id', async (req, reply) => {
    const { id } = req.params;
    try {
      const user = await User.query().findById(id);
      if (!user) return reply.code(404).send({ error: 'User not found' });

      await user.$query().patch(req.body);
      reply.send({ success: true });
    } catch ({ data }) {
      reply.code(422).send({ error: 'Update failed', errors: data });
    }
  });

  app.delete('/api/users/:id', async (req, reply) => {
    const { id } = req.params;
    const user = await User.query().findById(id);
    if (!user) return reply.code(404).send({ error: 'User not found' });

    const hasTasks = await Task.query()
      .where('authorId', id)
      .orWhere('executorId', id)
      .resultSize();

    if (hasTasks > 0) {
      return reply.code(400).send({ error: 'User has related tasks' });
    }

    await user.$query().delete();
    reply.send({ success: true });
  });
};
