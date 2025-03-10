import i18next from "i18next";
import middleware from "i18next-http-middleware";
import locales from "../../locales/index.js";
import fastifyPlugin from "fastify-plugin";

await i18next.use(middleware.LanguageDetector).init({
  fallbackLng: "ru",
  resources: locales,
  detection: {
    order: ["querystring", "cookie", "header"],
    caches: ["cookie"],
  },
});

async function localizationPlugin(app) {
  app.addHook("onRequest", (req, reply, done) => {
    middleware.handle(i18next)(req, reply, done);
  });

  app.addHook("preHandler", (req, reply, done) => {
    if (req.i18n) {
      req.t = req.i18n.t.bind(req.i18n);
    } else {
      req.t = (key) => key;
    }
    done();
  });

  app.get("/change-language/:lng", async (req, reply) => {
    const { lng } = req.params;
    req.i18n.changeLanguage(lng);
    reply.setCookie("i18next", lng, { path: "/", httpOnly: false });
    return reply.redirect(req.headers.referer || "/");
  });
}

export default fastifyPlugin(localizationPlugin);
