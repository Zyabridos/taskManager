export default (app) => {
  app
    .get('/session/new', { name: 'newSession' }, (req, reply) => {
      const signInForm = {};
      reply.render('session/new', { signInForm });
    })
    .post('/session', async (req, reply) => {
      try {
        console.log('Received login request with data:', req.body.data);

        const { email, password } = req.body.data;
        if (!email || !password) {
          console.log('Missing email or password');
          return reply
            .status(400)
            .send({ error: 'Email and password are required' });
        }

        const user = await app.objection.models.user.query().findOne({ email });

        if (!user) {
          console.log(`User not found for email: ${email}`);
          return reply.status(401).send({ error: 'Invalid email or password' });
        }

        if (!user.verifyPassword(password)) {
          console.log(`Invalid password for user: ${email}`);
          return reply.status(401).send({ error: 'Invalid email or password' });
        }

        req.session.set('userId', user.id);
        console.log(`Session userId after login: ${req.session.get('userId')}`);

        reply.redirect('/');
      } catch (error) {
        console.error('Error in login:', error);
        reply.status(500).send({ error: 'Internal Server Error' });
      }
    })

    .delete('/session', (req, reply) => {
      req.logOut();
      // reply.redirect(app.reverse('root'));
      reply.redirect('/');
    });
};
