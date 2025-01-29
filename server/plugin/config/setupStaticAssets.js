import path from 'path';
import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(path.dirname(import.meta.url));

const setUpStaticAssets = (app) => {
  const pathPublic = path.join(__dirname, '../../../', 'dist');
  console.log(pathPublic)
  app.register(fastifyStatic, {
    root: pathPublic,
    prefix: '/assets/',
  });
};

export default setUpStaticAssets;
