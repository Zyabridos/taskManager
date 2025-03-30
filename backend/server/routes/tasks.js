export default (app) => {
  app
    .get('/api/tasks', async (req, reply) => {
      try {
        const { status, executor, isCreatorUser, onlyExecutorTasks, label } = req.query;

        const query = app.objection.models.task
          .query()
          .withGraphJoined('[status, executor, author, labels]')
          .select('tasks.*');

        if (status) query.where('tasks.statusId', Number(status));
        if (executor) query.where('tasks.executorId', Number(executor));
        if (isCreatorUser === 'true') query.where('tasks.authorId', req.session.userId);
        if (onlyExecutorTasks === 'true') query.where('tasks.executorId', req.session.userId);
        if (label) query.where('labels.id', Number(label));

        const tasks = await query;
        reply.send(tasks);
      } catch (err) {
        console.error(err);
        reply.code(500).send({ error: 'Internal Server Error' });
      }
    })

    .get('/api/tasks/meta', async (req, reply) => {
      try {
        const statuses = await app.objection.models.status.query().select('id', 'name');
        const executors = await app.objection.models.user
          .query()
          .select('id', 'firstName', 'lastName');
        const labels = await app.objection.models.label.query().select('id', 'name');

        const executorsWithFullName = executors.map((user) => ({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
        }));

        reply.send({
          statuses,
          executors: executorsWithFullName,
          labels,
        });
      } catch (err) {
        console.error('Error loading meta:', err);
        reply.code(500).send({ error: 'Failed to load meta data' });
      }
    })

    .get('/api/tasks/:id', async (req, reply) => {
      try {
        const task = await app.objection.models.task
          .query()
          .findById(req.params.id)
          .withGraphFetched('[status, executor, author, labels]');

        if (!task) return reply.code(404).send({ error: 'Task not found' });

        reply.send(task);
      } catch (err) {
        console.error(err);
        reply.code(500).send({ error: 'Internal Server Error' });
      }
    })

    .post('/api/tasks', async (req, reply) => {
      try {
        const { name, description, statusId, executorId, labels = [] } = req.body;
        if (!req.user) {
          return reply.code(401).send({ error: 'Unauthorized' });
        }
        const { id: authorId } = req.user;

        const labelIds = Array.isArray(labels)
          ? labels.map(Number)
          : [Number(labels)].filter((id) => !Number.isNaN(id));

        const taskData = {
          name,
          description,
          statusId,
          executorId,
          authorId,
        };

        const result = await app.objection.models.task.transaction(async (trx) => {
          const labelRefs = labelIds.map((id) => ({ id }));

          const taskWithLabels = { ...taskData, labels: labelRefs };

          return app.objection.models.task
            .query(trx)
            .insertGraph(taskWithLabels, { relate: ['labels'] });
        });

        reply.code(201).send(result);
      } catch (err) {
        console.error(err);
        reply.code(422).send({ error: 'Validation failed', details: err.data });
      }
    })

    .patch('/api/tasks/:id', async (req, reply) => {
      try {
        const { id } = req.params;
        const { name, description, statusId, executorId, labels = [] } = req.body;

        const prevTask = await app.objection.models.task
          .query()
          .withGraphJoined('[status, author, executor, labels]')
          .findById(id);

        if (!prevTask) return reply.code(404).send({ error: 'Task not found' });

        const updatedData = {
          id: Number(id),
          name,
          description,
          statusId,
          executorId,
          authorId: prevTask.authorId,
        };

        const labelIds = labels.map((labelId) => ({ id: Number(labelId) }));

        await app.objection.models.task.transaction(async (trx) => {
          await app.objection.models.task
            .query(trx)
            .upsertGraph({ ...updatedData, labels: labelIds }, { relate: true, unrelate: true });
        });

        reply.send({ success: true });
      } catch (err) {
        console.error(err);
        reply.code(422).send({ error: 'Update failed', details: err.data });
      }
    })

    .delete('/api/tasks/:id', async (req, reply) => {
      try {
        const { id } = req.params;
        const task = await app.objection.models.task.query().findById(id);

        if (!task) return reply.code(404).send({ error: 'Task not found' });

        await task.$query().delete();
        reply.send({ success: true });
      } catch (err) {
        console.error(err);
        reply.code(500).send({ error: 'Internal Server Error' });
      }
    });
};
