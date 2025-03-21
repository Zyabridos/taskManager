import path from 'path';
import { fileURLToPath } from 'url';

import fastifyStatic from '@fastify/static';

const __dirname = fileURLToPath(path.dirname(import.meta.url));

const setUpStaticAssets = (app) => {
  const pathPublic = path.join(__dirname, '../../../', 'dist');
  console.log(pathPublic);
  app.register(fastifyStatic, {
    root: pathPublic,
    prefix: '/assets/',
  });
};

export default setUpStaticAssets;
