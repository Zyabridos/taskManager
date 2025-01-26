import i18next from 'i18next';

export default (app) => {
  app
    // Форма входа
    .get('/session/new', { name: 'newSession' }, (req, reply) => {
      const signInForm = {};
      reply.render('session/new', { signInForm });
    })

    // Авторизация пользователя
    // .post(
    //   '/session',
    //   { name: 'session' },
    //   app.fp.authenticate('form', async (req, reply, err, user) => {
    //     if (err) {
    //       return app.httpErrors.internalServerError(err);
    //     }
    //     if (!user) {
    //       const signInForm = req.body;
    //       const errors = {
    //         email: [{ message: i18next.t('flash.session.create.error') }],
    //       };
    //       reply.render('session/new', { signInForm, errors });
    //       return reply;
    //     }

    //     await req.logIn(user);

    //     reply.redirect('/');
    //     return reply;
    //   })
    // )

    // .post('/api/session', async (req, reply) => {
    .post('/session', async (req, reply) => {
      const { email, password } = req.body;
      console.log('Полученные данные для входа:', { email, password });

      // пока так
      if (email === 'zyabrina95@gmail.com.com' && password === 'aaa') {
        reply.send({ message: 'Login successful' });
      } else {
        reply.code(401).send({ error: 'Invalid credentials' });
      }
    })

    // Выход из системы
    .delete('/session', async (req, reply) => {
      console.log('User logging out...');
      await req.logOut();
      reply.redirect('/');
    });
};
