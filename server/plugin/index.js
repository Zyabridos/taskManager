import registerPlugins from "./plugins/registerPlugins.js";
import setUpViews from "./config/setupViews.js";
import setUpStaticAssets from "./config/setupStaticAssets.js";
import addHooks from "./middlewares/addHooks.js";
import addRoutes from "../routes/index.js";
import localizationPlugin from "./config/setupLocalization.js";

export default async (app) => {
  await registerPlugins(app);
  await app.register(localizationPlugin);
  setUpViews(app);
  setUpStaticAssets(app);
  await addRoutes(app);
  addHooks(app);

  return app;
};
