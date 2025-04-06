export default async (app) => {
  const { label: Label, task: Task } = app.objection.models;

  app.get('/api/labels', async (req, reply) => {
    const labels = await Label.query().select('id', 'name', 'createdAt');
    reply.send(labels);
  });

  app.get('/api/labels/:id', async (req, reply) => {
    const label = await Label.query().findById(req.params.id);
    if (!label) return reply.status(404).send({ error: 'label not found' });
    reply.send(label);
  });

  app.post('/api/labels', async (req, reply) => {
    try {
      const newLabel = await Label.query().insert(req.body);
      reply.code(201).send(newLabel);
    } catch ({ data }) {
      reply.code(422).send({ error: 'Validation failed', errors: data });
    }
  });

  app.patch('/api/labels/:id', async (req, reply) => {
    const { id } = req.params;
    try {
      const label = await Label.query().findById(id);
      if (!label) return reply.code(404).send({ error: 'label not found' });

      await label.$query().patch(req.body);
      reply.send({ success: true });
    } catch ({ data }) {
      reply.code(422).send({ error: 'Update failed', errors: data });
    }
  });

  app.delete('/api/labels/:id', async (req, reply) => {
    const { id } = req.params;
    const label = await Label.query().findById(id);
    if (!label) return reply.code(404).send({ error: 'label not found' });

    const hasTasks = await Task.query()
      .where('authorId', id)
      .orWhere('executorId', id)
      .resultSize();

    if (hasTasks > 0) {
      return reply.code(400).send({ error: 'label has related tasks' });
    }

    await label.$query().delete();
    reply.send({ success: true });
  });
};
