/* eslint-disable consistent-return */
import i18next from 'i18next';

import prepareTaskViewData from '../utils/prepareTaskViewData.js';

export default (app) => {
  app
    .get('/tasks', { name: 'tasks' }, async (req, reply) => {
      const {
        status,
        executor,
        isCreatorUser,
        onlyExecutorTasks,
        label,
      } = req.query;

      try {
        const { statuses, executors, labels } = await prepareTaskViewData(app);

        const query = app.objection.models.task
          .query()
          .withGraphJoined('[status, executor, author, labels]')
          .select(
            'tasks.*',
            'status.name as statusName',
            'executor.firstName as executorFirstName',
            'executor.lastName as executorLastName',
            'author.firstName as authorFirstName',
            'author.lastName as authorLastName',
          );

        if (status) query.where('tasks.status_id', Number(status));
        if (executor) query.where('tasks.executor_id', Number(executor));
        if (isCreatorUser === 'true') query.where('tasks.author_id', req.session.userId);
        if (onlyExecutorTasks === 'true') query.where('tasks.executor_id', req.session.userId);
        if (label) query.where('labels.id', Number(label));

        const tasks = await query;

        if (req.headers.accept === 'application/json') {
          return reply.send(tasks);
        }

        reply.render('tasks/index', {
          tasks,
          statuses,
          executors,
          labels,
          query: req.query || {},
          selectedStatus: status || '',
          selectedExecutor: executor || '',
          selectedLabel: label || '',
          isCreatorUser: isCreatorUser === 'true',
          onlyExecutorTasks: onlyExecutorTasks === 'true',
        });
      } catch (error) {
        console.error('Error fetching tasks:', error);
        reply.code(500).send({ error: 'Internal Server Error' });
      }
      return reply;
    })

    .get('/tasks/new', { name: 'newTask' }, async (req, reply) => {
      try {
        const task = new app.objection.models.task();
        const statuses = await app.objection.models.status.query();
        const users = await app.objection.models.user.query();
        const labels = await app.objection.models.label.query();

        reply.render('tasks/new', {
          task,
          statuses,
          users,
          labels,
          errors: {},
        });
        return reply;
      } catch (error) {
        console.error('Error fetching data for new task:', error);
        req.flash('error', i18next.t('flash.tasks.create.error'));
        return reply.status(500).send('Internal Server Error');
      }
    })

    .get('/tasks/:id/edit', { name: 'editTask' }, async (req, reply) => {
      try {
        const { id } = req.params;

        const task = await app.objection.models.task
          .query()
          .findById(id)
          .withGraphFetched('[status, executor, labels]');

        if (!task) {
          console.log('task not found');
          req.flash('error', i18next.t('flash.tasks.edit.notFound'));
          return reply.redirect('/tasks');
        }

        const { statuses, executors, labels } = await prepareTaskViewData(app);

        await reply.render('tasks/edit', {
          task,
          statuses,
          executors,
          labels,
          errors: {},
        });

        return reply;
      } catch (error) {
        console.error('Error fetching task:', error);
        req.flash('error', i18next.t('flash.tasks.edit.error'));
        return reply.redirect('/tasks');
      }
    })

    .post('/tasks', { name: 'createTask' }, async (req, reply) => {
      const {
        name,
        description,
        statusId,
        executorId,
        labels,
      } = req.body.data;

      const { id: authorId } = req.user;
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

      try {
        await app.objection.models.task.transaction(async (trx) => {
          const labelObjects = labelIds.length > 0
            ? await app.objection.models.label.query(trx).whereIn('id', labelIds)
            : [];

          const taskWithLabels = {
            ...taskData,
            labels: labelObjects,
          };

          return app.objection.models.task
            .query(trx)
            .insertGraph(taskWithLabels, { relate: ['labels'] });
        });

        req.flash('info', i18next.t('flash.tasks.create.success'));
        reply.redirect('/tasks');
      } catch (error) {
        console.error('Error during task creation:', error);
        req.flash('error', i18next.t('flash.tasks.create.error'));

        const { statuses, executors, labels: availableLabels } = await prepareTaskViewData(app);

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

    .get('/tasks/:id', { name: 'task', preValidation: app.authenticate }, async (req, reply) => {
      const taskId = Number(req.params.id);
      const task = await app.objection.models.task
        .query()
        .findById(taskId)
        .withGraphFetched('[status, executor, author, labels]');

      reply.render('tasks/task', { task });
      return reply;
    })

    .patch('/tasks/:id', { name: 'updateTask' }, async (req, reply) => {
      const taskId = Number(req.params.id);
      const {
        name,
        description,
        statusId,
        executorId,
        labels: labelsList = [],
      } = req.body.data;

      try {
        const prevTask = await app.objection.models.task
          .query()
          .withGraphJoined('[status, author, executor, labels]')
          .findById(taskId);

        console.log('Full Request body:', req.body);
        console.log('Labels list:', labelsList);

        if (!prevTask) {
          req.flash('error', i18next.t('flash.tasks.edit.notFound'));
          return reply.status(404).send('Task not found');
        }

        const updatedData = {
          id: taskId,
          name,
          description,
          statusId: Number(statusId),
          executorId: Number(executorId),
          authorId: prevTask.authorId,
        };

        const labelIds = labelsList.map((labelId) => ({ id: Number(labelId) }));

        await app.objection.models.task.transaction(async (trx) => {
          await app.objection.models.task.query(trx).upsertGraph(
            {
              ...updatedData,
              labels: labelIds,
            },
            { relate: true, unrelate: true },
          );
        });

        req.flash('info', i18next.t('flash.tasks.edit.success'));
        return reply.redirect('/tasks');
      } catch (error) {
        console.error('Error updating task:', error);
        req.flash('error', i18next.t('flash.tasks.edit.error'));

        const { statuses, executors, labels } = await prepareTaskViewData(app);

        return reply.render('tasks/edit', {
          task: {
            id: taskId,
            name,
            description,
            statusId,
            executorId,
            labels: labelsList,
          },
          statuses,
          executors,
          labels,
          errors: error.data || {},
        });
      }
    })

    .delete('/tasks/:id', { name: 'deleteTask' }, async (req, reply) => {
      try {
        const { id } = req.params;
        const task = await app.objection.models.task.query().findById(id);
        if (!task) {
          req.flash('error', i18next.t('flash.tasks.delete.notFound'));
          return reply.status(404).send('Task not found');
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
