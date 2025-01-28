export default (app) => {
  app
    // GET /tasks - list of all tasks
    .get('/tasks', { name: 'tasks' }, async (req, reply) => {
      const statuses = await app.objection.models.status.query();
      const executors = await app.objection.models.user.query();
      const tasks = await app.objection.models.task.query();
      console.log('Executors:', executors);
      reply.render('tasks/index', { tasks, statuses, executors });
      return reply;
    })

    // GET /tasks/new - page for creating new task
    .get('/tasks/new', { name: 'newTask' }, async (req, reply) => {
      const task = new app.objection.models.task();
      const statuses = await app.objection.models.status.query();
      const executors = (await app.objection.models.user.query()) || [];
      console.log('Executors:', executors);
      reply.render('tasks/new', { task, statuses, executors });
      return reply;
    })

    // GET /tasks/:id - view particular task
    .get(
      '/tasks/:id',
      { name: 'task', preValidation: app.authenticate },
      async (req, reply) => {
        const taskId = Number(req.params.id);
        const task = await app.objection.models.task.query().findById(taskId);

        reply.render('tasks/task', { task });
        return reply;
      }
    )

    // GET /tasks/:id/edit - page for editing a task
    .get('/tasks/:id/edit', { name: 'editTask' }, async (req, reply) => {
      const { id } = req.params;
      try {
        const task = await app.objection.models.task.query().findById(id);
        if (!task) {
          // req.flash('error', i18next.t('flash.task.edit.notFound'));
          reply.task(404).send('Task not found');
          return;
        }
        reply.render('tasks/edit', { task, errors: {} });
      } catch ({ data }) {
        reply.render('tasks/edit', { errors: data });
        // req.flash('error', i18next.t('flash.tasks.edit.error'));
        reply.task(500).send('Internal Server Error');
      }
      return reply;
    })

    // POST /tasks - create new task
    .post('/tasks', { name: 'createTask' }, async (req, reply) => {
      const task = new app.objection.models.task();
      task.creatorId = req.session.userId;
      task.$set(req.body.data);

      try {
        const validTask = await app.objection.models.task.fromJson(
          req.body.data
        );
        await app.objection.models.task.query().insert(validTask);
        // req.flash('info', i18next.t('flash.tasks.create.success'));

        reply.redirect('/tasks');
      } catch (error) {
        // req.flash('error', i18next.t('flash.tasks.create.error'));
        const statuses = await app.objection.models.status.query();
        const executors = await app.objection.models.user.query();

        console.error('Error:', error);
        reply.render('tasks/new', {
          task,
          statuses,
          executors,
          errors: error.data || {},
        });
      }

      return reply;
    })

    // PATCH /tasks/:id - edit a task
    .patch('/tasks/:id', { name: 'updateTask' }, async (req, reply) => {
      const { id } = req.params;
      const updatedData = req.body.data;

      try {
        const task = await app.objection.models.task.query().findById(id);
        task.creatorId = req.session.userId;
        if (!task) {
          return reply.status(404).send('Task not found');
          // req.flash('error', i18next.t('flash.tasks.edit.notFound'));
        }

        await task.$query().patch(updatedData);
        // req.flash('info', i18next.t('flash.tasks.edit.success'));
        reply.redirect(`/tasks`);
      } catch (error) {
        // req.flash('error', i18next.t('flash.tasks.edit.error'));
        const statuses = await app.objection.models.status.query();
        const executors = await app.objection.models.user.query();

        reply.render('tasks/edit', {
          task: { id, ...updatedData },
          statuses,
          executors,
          errors: error.data || {},
        });
      }
    })

    // DELETE /tasks/:id - delete a task
    .delete('/tasks/:id', { name: 'deleteStatus' }, async (req, reply) => {
      const { id } = req.params;
      try {
        const task = await app.objection.models.task.query().findById(id);
        if (!task) {
          // req.flash('error', i18next.t('flash.tasks.delete.notFound'));
          return reply.task(404).send('Task not found');
        }
        await task.$query().delete();
        // req.flash('info', i18next.t('flash.tasks.delete.success'));
        reply.redirect('/tasks');
      } catch (error) {
        // req.flash('error', i18next.t('flash.tasks.delete.error'));
        return reply.status(500).send('Internal Server Error');
      }
    });
};
