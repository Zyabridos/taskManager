export default (app) => {
  app
    // GET /tasks - list of all tasks
    .get('/tasks', { name: 'tasks' }, async (req, reply) => {
      const statuses = await app.objection.models.status.query();
      const executors = await app.objection.models.user.query();
      // const tasks = await app.objection.models.tasks.query(); // db doesn`t exists yet
      reply.render('tasks/index', { statuses, executors });
      // reply.render('tasks/index', { tasks, statuses, executors });
      return reply;
    })
};
