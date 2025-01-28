export default (app) => {
  app
    // GET /statuses - list of all statuses
    .get('/statuses', { name: 'statuses' }, async (req, reply) => {

      const statuses = await app.objection.models.status.query();
      reply.render('statuses/index', { statuses });
      return reply;
    })

    // GET /statuses/new - page for creating new status
    .get('/statuses/new', { name: 'newStatus' }, (req, reply) => {
      const status = new app.objection.models.status();
      reply.render('statuses/new', { status });
    })

    // GET /statuses/:id/edit - page for editing a status

    // POST /statuses - create new status
    .post('/statuses', async (req, reply) => {
      const status = new app.objection.models.status();
      status.$set(req.body.data);

      try {
        const validStatus = await app.objection.models.status.fromJson(
          req.body.data
        );
        await app.objection.models.status.query().insert(validStatus);
        // req.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect('/statuses');
      } catch ({ data }) {
        // req.flash('error', i18next.t('flash.users.create.error'));
        reply.render('statuses/new', { status, errors: data });
      }

      return reply;
    })

    // PATCH /statuses/:id - edit a status

    // DELETE /statuses/:id - delete a status
};
