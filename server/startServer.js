import fastify from 'fastify';
import init from './index.js';

const app = fastify({ logger: true });
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await init(app);

  app.ready((err) => {
    if (err) throw err;
    console.log(`Зарегестрированные маршруты: ${app.printRoutes()}`); // show routes
  });

  app.addHook('onRequest', (req, reply, done) => {
    console.log(`Метод запроса: ${req.method}, URL: ${req.url}`);
    done();
  });

  app.listen(
    {
      port: PORT,
      host: '0.0.0.0',
    },
    (err, address) => {
      if (err) {
        app.log.error(err);
        process.exit(1);
      }
      app.log.info(`Server is running on ${address}`);
    }
  );
};

startServer();
