export default async (app) => {
  const { status: Status, task: Task } = app.objection.models;

  app.get('/api/statuses', async (req, reply) => {
    const statuses = await Status.query().select('id', 'name', 'createdAt');
    reply.send(statuses);
  });

  app.get('/api/statuses/:id', async (req, reply) => {
    const status = await Status.query().findById(req.params.id);
    if (!status) return reply.status(404).send({ error: 'status not found' });
    reply.send(status);
  });

  app.post('/api/statuses', async (req, reply) => {
    try {
      const newstatus = await Status.query().insert(req.body);
      reply.code(201).send(newstatus);
    } catch ({ data }) {
      reply.code(422).send({ error: 'Validation failed', errors: data });
    }
  });

  app.patch('/api/statuses/:id', async (req, reply) => {
    const { id } = req.params;
    try {
      const status = await Status.query().findById(id);
      if (!status) return reply.code(404).send({ error: 'status not found' });

      await status.$query().patch(req.body);
      reply.send({ success: true });
    } catch ({ data }) {
      reply.code(422).send({ error: 'Update failed', errors: data });
    }
  });

  app.delete('/api/statuses/:id', async (req, reply) => {
    const { id } = req.params;
    const status = await Status.query().findById(id);
    if (!status) return reply.code(404).send({ error: 'status not found' });

    const hasTasks = await Task.query().where('statusId', id).resultSize();

    if (hasTasks > 0) {
      return reply.code(422).send({
        error: 'Status in use',
        message: 'Cannot delete status with existing tasks',
      });
    }

    await status.$query().delete();
    reply.send({ success: true });
  });
};
