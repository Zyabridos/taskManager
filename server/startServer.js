import fastify from 'fastify'
import init from './index.js';

const app = fastify({ logger: true });
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await init(app)

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