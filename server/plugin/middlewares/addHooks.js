const addHooks = (app) => {
  app.addHook('preHandler', async (req, reply) => {
    reply.locals = {
      isAuthenticated: () => req.isAuthenticated(),
    };
  });

  app.addHook('onRequest', (req, reply, done) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    done();
  });
};

export default addHooks;
