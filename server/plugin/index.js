import registerPlugins from "./plugins/registerPlugins.js";
import setupLocalization from "./config/setupLocalization.js";
import setUpViews from "./config/setupViews.js";
import setUpStaticAssets from "./config/setupStaticAssets.js";
import addHooks from "./middlewares/addHooks.js";
import addRoutes from "../routes/index.js";

export default async (app) => {
  await registerPlugins(app);
  await setupLocalization();
  setUpViews(app);
  setUpStaticAssets(app);
  await addRoutes(app);
  addHooks(app);

  return app;
};
