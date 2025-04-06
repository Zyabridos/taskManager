import addRoutes from '../routes/index.js';

import registerPlugins from './plugins/registerPlugins.js';
import setUpViews from './config/setupViews.js';
import setUpStaticAssets from './config/setupStaticAssets.js';
import addHooks from './middlewares/addHooks.js';

const init = async (app) => {
  await registerPlugins(app);
  setUpViews(app);
  setUpStaticAssets(app);
  await addRoutes(app);
  addHooks(app);

  return app;
};

export default init;
