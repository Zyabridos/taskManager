import i18next from 'i18next';

export default (app) => {
  app
    // GET /tasks - list of all tasks
    .get('/tasks', { name: 'tasks' }, async (req, reply) => {
      // параметры фильтрации из запроса
      const { status, executor, isCreatorUser, onlyExecutorTasks } = req.query;
      try {
        const statuses = await app.objection.models.status.query();
        const executors = await app.objection.models.user.query();

        // сформируем запрос учитывая фильтры
        const query = app.objection.models.task
          .query()
          .withGraphFetched('[status, executor, author]');

        if (status && !Number.isNaN(status)) {
          query.where('statusId', Number(status));
        }

        if (executor && !Number.isNaN(executor)) {
          query.where('executorId', Number(executor));
        }

        if (isCreatorUser !== undefined) {
          query.where('authorId', req.session.userId);
        }

        if (onlyExecutorTasks !== undefined) {
          query.where('executorId', req.session.userId);
        }

        // отфильтрованные задачи
        const tasks = await query;
        reply.render('tasks/index', {
          tasks,
          statuses,
          executors,
          selectedStatus: status || '',
          selectedExecutor: executor || '',
          isCreatorUser: Boolean(isCreatorUser),
          onlyExecutorTasks: Boolean(onlyExecutorTasks),
        });

        console.log('Filtered tasks: ', tasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        reply.code(500).send({ error: 'Internal Server Error' });
      }

      return reply;
    })

    // GET /tasks/new - page for creating new task
    .get('/tasks/new', { name: 'newTask' }, async (req, reply) => {
      const task = new app.objection.models.task();
      const statuses = await app.objection.models.status.query();
      const executors = (await app.objection.models.user.query()) || [];
      const labels = (await app.objection.models.label.query()) || [];
      reply.render('tasks/new', { task, statuses, executors, labels });
      return reply;
    })

    // GET /tasks/:id - view particular task
    .get(
      '/tasks/:id',
      { name: 'task', preValidation: app.authenticate },
      async (req, reply) => {
        const taskId = Number(req.params.id);
        const task = await app.objection.models.task
          .query()
          .findById(taskId)
          .withGraphFetched('[status, executor, author]'); // снова загружаем связанный с таском данные

        reply.render('tasks/task', { task });
        return reply;
      }
    )

    // GET /tasks/:id/edit - page for editing a task
    .get('/tasks/:id/edit', { name: 'editTask' }, async (req, reply) => {
      const { id } = req.params;
      try {
        const task = await app.objection.models.task
          .query()
          .findById(id)
          .withGraphFetched('[status, executor, author]');
        if (!task) {
          req.flash('error', i18next.t('flash.task.edit.notFound'));
          reply.task(404).send('Task not found');
          return;
        }
        reply.render('tasks/edit', { task, errors: {} });
      } catch ({ data }) {
        reply.render('tasks/edit', { errors: data });
        req.flash('error', i18next.t('flash.tasks.edit.error'));
        reply.task(500).send('Internal Server Error');
      }
      return reply;
    })

    // POST /tasks - create new task
    .post('/tasks', { name: 'createTask' }, async (req, reply) => {
  console.log('Form data:', req.body);

  const { name, description, statusId, executorId, labels } = req.body.data;
  const { id: authorId } = req.user;

  // Преобразуем метки в массив чисел
  const labelIds = Array.isArray(labels)
    ? labels.map(Number)
    : [Number(labels)].filter((id) => !Number.isNaN(id));

  const taskData = {
    name,
    description,
    statusId: Number(statusId),
    executorId: Number(executorId),
    authorId: Number(authorId),
  };

  console.log('taskData: ', taskData);

  try {
    // Создаем задачу без labels
    const newTask = await app.objection.models.task.query().insert(taskData);

    console.log('New Task Created:', newTask);

    // Добавляем связи в таблицу task_labels
    if (labelIds.length > 0) {
      await app.objection.models.task.relatedQuery('labels')
        .for(newTask.id)
        .relate(labelIds);
    }

    req.flash('info', i18next.t('flash.tasks.create.success'));
    reply.redirect('/tasks');
  } catch (error) {
    console.error('Error:', error);
    req.flash('error', i18next.t('flash.tasks.create.error'));
    const statuses = await app.objection.models.status.query();
    const executors = await app.objection.models.user.query();
    const availableLabels = await app.objection.models.label.query();

    reply.render('tasks/new', {
      task: taskData,
      statuses,
      executors,
      labels: availableLabels,
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
        task.authorId = req.session.userId;
        if (!task) {
          req.flash('error', i18next.t('flash.tasks.edit.notFound'));
          return reply.status(404).send('Task not found');
        }

        await task.$query().patch(updatedData);
        req.flash('info', i18next.t('flash.tasks.edit.success'));
        reply.redirect(`/tasks`);
      } catch (error) {
        req.flash('error', i18next.t('flash.tasks.edit.error'));
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
          req.flash('error', i18next.t('flash.tasks.delete.notFound'));
          return reply.task(404).send('Task not found');
        }
        await task.$query().delete();
        req.flash('info', i18next.t('flash.tasks.delete.success'));
        reply.redirect('/tasks');
      } catch (error) {
        req.flash('error', i18next.t('flash.tasks.delete.error'));
        return reply.status(500).send('Internal Server Error');
      }
    });
};
