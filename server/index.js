// // import fastify from 'fastify';
// // import fastifyView from 'point-of-view';
// // import fastifyStatic from '@fastify/static';
// // import pug from 'pug';
// // import i18next from 'i18next';
// // import middleware from 'i18next-http-middleware';
// // import path from 'path';
// // import fastifyFormbody from '@fastify/formbody';
// // import fastifyCookie from '@fastify/cookie';
// // import sqlite3 from 'sqlite3';
// // import session from '@fastify/session';
// // import fastifyFlash from '@fastify/flash';
// // import userRoutes from './routes/users.js';
// // import en from './locales/en.js';
// // import ru from './locales/ru.js';
// // import sessionsRoutses from './routes/sessions.js';
// // import changeLanguage from './routes/index.js';
// // import prepareDatabase from './db/init.js';

// // const __dirname = path.dirname(new URL(import.meta.url).pathname);
// // const PORT = process.env.PORT || 3000;

// // const db = new sqlite3.Database(':memory:');
// // prepareDatabase(db);
// // const app = fastify({ logger: true });
// // console.log(app.printRoutes())

// // // Настройка i18next с использованием cookies для сохранения языка
// // const setupLocalization = async () => {
// //   i18next.use(middleware.LanguageDetector).init({
// //     lng: 'en',
// //     fallbackLng: 'en',
// //     resources: { en, ru },
// //     detection: {
// //       order: ['cookie', 'header'],
// //       caches: ['cookie'],
// //     },
// //   });
// // };

// // const registerPlugins = async (app) => {
// //   app.register(middleware.plugin, { i18next });
// //   app.register(fastifyFormbody);
// //   app.register(fastifyCookie);
// //   app.register(session, {
// //     secret: 'a secret with minimum length of 32 characters',
// //     cookie: {
// //       secure: false,
// //     },
// //   });
// //   // app.register(fastifyFlash);
// // };

// // // хук для просмотра настроек текущей сессии
// // // app.addHook('preHandler', (req, res, done) => {
// // //   console.log('Текущая сессия:', req.session);
// // //   done();
// // // });

// // // app.addHook('onRequest', (req, res, done) => {
// // //   console.log(`Incoming request: ${req.method} ${req.url}`);
// // //   done();
// // // });

// // const setUpViews = (app) => {
// //   app.register(fastifyView, {
// //     engine: { pug },
// //   });
// // };

// // const setUpStaticAssets = (app) => {
// //   app.register(fastifyStatic, {
// //     root: path.join(__dirname, 'styles'),
// //     prefix: '/styles/',
// //   });
// // };

// // // Регистрируем маршруты
// // const addRoutes = (app, db) => {
// //   app.register(sessionsRoutses, { db });
// //   app.register(changeLanguage);
// //   // для пользователей передает БД как options
// //   app.register(userRoutes, { db });
// // };

// // // Запуск сервера
// // app.listen(
// //   {
// //     port: PORT,
// //     host: '0.0.0.0',
// //   },
// //   (err, address) => {
// //     if (err) {
// //       app.log.error(err);
// //       process.exit(1);
// //     }
// //     app.log.info(`Server is running on ${address}`);
// //   }
// // );

// // const init = async (app) => {
// //   await registerPlugins(app);

// //   await setupLocalization();
// //   setUpViews(app);
// //   setUpStaticAssets(app);
// //   addRoutes(app);

// //   return app;
// // };

// // init(app);

// // export default app;

// import fastify from 'fastify';
// import fastifyView from 'point-of-view';
// import fastifyStatic from '@fastify/static';
// import pug from 'pug';
// import i18next from 'i18next';
// import middleware from 'i18next-http-middleware';
// import path from 'path';
// import fastifyFormbody from '@fastify/formbody';
// import fastifyCookie from '@fastify/cookie';
// import session from '@fastify/session';
// import fastifyFlash from '@fastify/flash';
// import sqlite3 from 'sqlite3';
// import userRoutes from './routes/users.js';
// import en from './locales/en.js';
// import ru from './locales/ru.js';
// import sessionsRoutses from './routes/sessions.js';
// import changeLanguage from './routes/index.js';
// import prepareDatabase from './db/init.js';

// const __dirname = path.dirname(new URL(import.meta.url).pathname);

// const setupLocalization = async () => {
//   i18next.use(middleware.LanguageDetector).init({
//     lng: 'en',
//     fallbackLng: 'en',
//     resources: { en, ru },
//     detection: {
//       order: ['cookie', 'header'],
//       caches: ['cookie'],
//     },
//   });
// };

// const registerPlugins = async (app) => {
//   app.register(middleware.plugin, { i18next });
//   app.register(fastifyFormbody);
//   app.register(fastifyCookie);
//   app.register(session, {
//     secret: 'a secret with minimum length of 32 characters',
//     cookie: {
//       secure: false,
//     },
//   });
//   app.register(fastifyFlash);
// };

// const setUpViews = (app) => {
//   app.register(fastifyView, {
//     engine: { pug },
//   });
// };

// const setUpStaticAssets = (app) => {
//   app.register(fastifyStatic, {
//     root: path.join(__dirname, 'styles'),
//     prefix: '/styles/',
//   });
// };

// const addRoutes = (app, db) => {
//   app.register(sessionsRoutses, { db });
//   app.register(changeLanguage);
//   app.register(userRoutes, { db });
// };

// const init = async () => {
//   const app = fastify({ logger: true });
//   const db = new sqlite3.Database(':memory:');
//   prepareDatabase(db);

//   await registerPlugins(app);
//   await setupLocalization();
//   setUpViews(app);
//   setUpStaticAssets(app);
//   addRoutes(app, db);

//   return app;
// };

// init();
// export default init;
import fastify from 'fastify';
import fastifyView from 'point-of-view';
import fastifyStatic from '@fastify/static';
import pug from 'pug';
import i18next from 'i18next';
import middleware from 'i18next-http-middleware';
import path from 'path';
import fastifyFormbody from '@fastify/formbody';
import fastifyCookie from '@fastify/cookie';
import sqlite3 from 'sqlite3';
import session from '@fastify/session';
import userRoutes from './routes/users.js';
import en from './locales/en.js';
import ru from './locales/ru.js';
import sessionsRoutses from './routes/sessions.js';
import changeLanguage from './routes/index.js';
import prepareDatabase from './db/init.js';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

async function init() {
  const PORT = process.env.PORT || 3000;
  const db = new sqlite3.Database(':memory:');
  prepareDatabase(db);

  const app = fastify({ logger: true });

  // Setup i18next
  i18next.use(middleware.LanguageDetector).init({
    lng: 'en',
    fallbackLng: 'en',
    resources: { en, ru },
    detection: {
      order: ['cookie', 'header'],
      caches: ['cookie'],
    },
  });

  // Register plugins
  app.register(middleware.plugin, { i18next });
  app.register(fastifyFormbody);
  app.register(fastifyCookie);
  app.register(session, {
    secret: 'a secret with minimum length of 32 characters',
    cookie: {
      secure: false,
    },
  });

  // Register static files
  // app.register(fastifyStatic, {
  //   root: path.join(__dirname, 'styles'),
  //   prefix: '/styles/',
  // });

  // Register view engine
  app.register(fastifyView, {
    engine: { pug },
  });

  // Register routes
   app.register(sessionsRoutses, { db }, { prefix: '/session' });
  app.register(userRoutes, { db }, { prefix: '/users' });
  app.register(changeLanguage, { prefix: '/change-language' });

  return { app, PORT };
}

async function startServer() {
  const { app, PORT } = await init();

  app.ready(err => {
  if (err) throw err;
  console.log(app.printRoutes());
});


  app.listen(
    {
      port: PORT,
      host: '0.0.0.0',
    },
    (err, address) => {
      if (err) {
        app.log.error(err);
        process.exit(1);
      }
      app.log.info(`Server is running on ${address}`);
    }
  );
}

// Start the server when this script is run
startServer();

export default init;
