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
  // console.log('Перед регистрацией маршрутов:', app.printRoutes());
  await addRoutes(app);
  // console.log('После регистрации маршрутов:', app.printRoutes());
  addHooks(app);

  return app;
};
