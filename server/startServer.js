import fastify from "fastify";
import init from "./plugin/index.js";

const app = fastify({ logger: true });
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await init(app);

    await app.ready();
    app.log.info("All plugins initialized successfully.");

    await app.listen({ port: PORT, host: "0.0.0.0" });

    app.log.info(`Server is running on http://localhost:${PORT}`);
  } catch (err) {
    app.log.error("Error starting the server:", err);
    process.exit(1);
  }
};

startServer();
