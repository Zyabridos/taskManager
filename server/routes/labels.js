import i18next from 'i18next';

export default (app) => {
  app
    // GET /labels - list of all labels
    .get('/labels', { name: 'labels' }, async (req, reply) => {
      const labels = await app.objection.models.label.query();
      reply.render('labels/index', { labels });
      return reply;
    })

    // GET /labels/new - page for creating new label
    .get('/labels/new', { name: 'newLabel' }, (req, reply) => {
      const label = new app.objection.models.label();
      reply.render('labels/new', { label });
    })

    // GET /labels/:id/edit - page for editing a label
    .get('/labels/:id/edit', { name: 'editlabel' }, async (req, reply) => {
      const { id } = req.params;
      try {
        const label = await app.objection.models.label.query().findById(id);
        if (!label) {
          req.flash('error', i18next.t('flash.label.edit.notFound'));
          reply.label(404).send('label not found');
          return;
        }
        console.log('label data:', label);
        reply.render('labels/edit', { label, errors: {} });
      } catch ({ data }) {
        reply.render('labels/edit', { errors: data });
        req.flash('error', i18next.t('flash.labels.edit.error'));
        reply.label(500).send('Internal Server Error');
      }
      return reply;
    })

    // POST /labels - create new label
    .post('/labels', { name: 'createlabel' }, async (req, reply) => {
      const label = new app.objection.models.label();

      try {
        const validlabel = await app.objection.models.label.fromJson(
          req.body.data,
        );
        await app.objection.models.label.query().insert(validlabel);
        req.flash('info', i18next.t('flash.labels.create.success'));
        reply.redirect('/labels');
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.labels.create.error'));
        reply.render('labels/new', { label, errors: data });
      }

      return reply;
    })

    // PATCH /labels/:id - edit a label
    .patch('/labels/:id', { name: 'updatelabel' }, async (req, reply) => {
      const { id } = req.params;
      const updatedData = req.body.data;
      try {
        const label = await app.objection.models.label.query().findById(id);
        if (!label) {
          req.flash('error', i18next.t('flash.labels.edit.notFound'));
          return reply.label(404).send('label not found');
        }
        await label.$query().patch(updatedData);
        req.flash('info', i18next.t('flash.labels.edit.success'));
        reply.redirect('/labels');
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.labels.edit.error'));
        reply.render('labels/edit', {
          label: { id, ...updatedData },
          errors: data,
        });
      }
    })

    // DELETE /labels/:id - delete a label
    .delete('/labels/:id', { name: 'deleteLabel' }, async (req, reply) => {
      const { id } = req.params;
      try {
        const label = await app.objection.models.label
          .query()
          .findById(id)
          .withGraphFetched('tasks');

        if (!label) {
          req.flash('error', i18next.t('flash.labels.delete.notFound'));
          return reply.status(404).send('Label not found');
        }

        if (label.tasks.length > 0) {
          req.flash('error', i18next.t('flash.labels.delete.hasTasks'));
          return reply.redirect('/labels');
        }

        await label.$query().delete();
        req.flash('info', i18next.t('flash.labels.delete.success'));
        return reply.redirect('/labels');
      } catch (error) {
        req.flash('error', i18next.t('flash.labels.delete.error'));
        return reply.status(500).send('Internal Server Error');
      }
    });
};
