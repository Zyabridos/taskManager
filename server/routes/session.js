export default (app) => {
  app
    .get('/session/new', { name: 'newSession' }, (req, reply) => {
      const signInForm = {};
      reply.render('session/new', { signInForm });
    })
    .post(
      '/session',
      { name: 'session' },
      app.fp.authenticate('form', async (req, reply, err, user) => {
        if (err) {
          return app.httpErrors.internalServerError(err);
        }
        if (!user) {
          const signInForm = req.body.data;
          const errors = {
            email: [{ message: 'something went wrong :(' }],
          };
          reply.render('session/new', { signInForm, errors });
          return reply;
        }
        await req.logIn(user);
        // reply.redirect(app.reverse('root'));
        reply.redirect('/');
        return reply;
      })
    )
    .delete('/session', (req, reply) => {
      req.logOut();
      // reply.redirect(app.reverse('root'));
      reply.redirect('/');
    });
};
