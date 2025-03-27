#!/usr/bin/env node

import buildApp from '../index.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    const app = await buildApp();
    app.log.info('All plugins initialized successfully.');
    await app.listen({ port: PORT, host: '0.0.0.0' });
    app.log.info(`Server is running on http://localhost:${PORT}`);
  } catch (err) {
    console.error('Error starting the server:', err);
    process.exit(1);
  }
};

startServer();