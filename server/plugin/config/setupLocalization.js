import i18next from "i18next";
import middleware from "i18next-http-middleware";
import ru from "../../locales/ru/index.js";
import en from "../../locales/en/index.js";
import fastifyPlugin from "fastify-plugin";

await i18next.use(middleware.LanguageDetector).init({
  fallbackLng: "ru",
  resources: { ru, en },
  detection: {
    order: ["querystring", "cookie", "header"],
    caches: ["cookie"],
  },
});

async function localizationPlugin(app) {
  app.addHook("onRequest", (req, reply, done) => {
    middleware.handle(i18next)(req, reply, done);
  });

  app.get("/change-language/:lng", async (req, reply) => {
    const { lng } = req.params;
    req.i18n.changeLanguage(lng);
    reply.setCookie("i18next", lng, { path: "/" });
    return reply.redirect(req.headers.referer || "/");
  });
}

export default fastifyPlugin(localizationPlugin);
