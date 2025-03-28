import i18next from 'i18next';

export default (app) => {
  app.get('/api/session', async (req, reply) => {
    if (!req.isAuthenticated()) {
      return reply.status(401).send({ error: i18next.t('errors.unauthorized') });
    }

    const { id, email } = req.user;
    return reply.send({ user: { id, email } });
  });

  app.post(
    '/api/session',
    { name: 'session' },
    app.fp.authenticate('form', async (req, reply, err, user) => {
      if (err) {
        req.log.error(err);
        return reply.status(500).send({ error: 'Internal server error' });
      }

      if (!user) {
        return reply.status(401).send({
          error: i18next.t('errors.wrongEmailOrPassword'),
        });
      }

      await req.logIn(user);
      req.session.userId = user.id;

      return reply.send({ user: { id: user.id, email: user.email } });
    }),
  );

  app.delete('/api/session', async (req, reply) => {
    await req.logOut();
    return reply.send({ message: i18next.t('flash.session.delete.success') });
  });
};
