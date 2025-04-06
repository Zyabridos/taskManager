export default (app) => {
  app
    .get('/api', { name: 'root' }, async (req, reply) => {
      reply.send({ message: 'Welcome to the API root' });
    })

    .get('/api/protected', {
      name: 'protected',
      preValidation: app.authenticate,
    }, async (req, reply) => {
      reply.send({ message: 'You have accessed a protected route', user: req.user });
    });
};
