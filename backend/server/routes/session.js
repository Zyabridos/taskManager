import i18next from 'i18next';

export default (app) => {
  app
    .get('/session/new', { name: 'newSession' }, (req, reply) => {
      const signInForm = {};
      reply.render('session/new', { signInForm });
    })
    app.post(
    '/api/session',
    { name: 'session' },
    app.fp.authenticate('form', async (req, reply, err, user) => {
      if (err) {
        req.log.error(err);
        return reply.status(500).send({ error: 'Internal server error' });
      }

      if (!user) {
        return reply.status(401).send({ error: i18next.t('errors.wrongEmailOrPassword') });
      }

      await req.logIn(user);
      req.session.userId = user.id;

      console.log('Server got this reply:', { user: { id: user.id, email: user.email }})
      return reply.send({ user: { id: user.id, email: user.email } });
    }),
  )

    .delete('/session', async (req, reply) => {
      await req.logOut();
      req.flash('info', i18next.t('flash.session.delete.success'));
      return reply.redirect('/');
    });
};
