import path from 'path';
import Pug from 'pug';
import fastifyView from '@fastify/view';
import { fileURLToPath } from 'url';
import getHelpers from '../../helpers/index.js';

const __dirname = fileURLToPath(path.dirname(import.meta.url));

const setUpViews = (app) => {
  const helpers = getHelpers(app);
  app.register(fastifyView, {
    engine: { pug: Pug },
    includeViewExtension: true,
    defaultContext: {
      ...helpers,
      assetPath: (filename) => `/assets/${filename}`,
      app,
    },
    templates: path.join(__dirname, '../..', 'views'),
  });

  app.decorateReply('render', function render(viewPath, locals) {
    this.view(viewPath, { ...locals, reply: this });
  });
};

export default setUpViews;
