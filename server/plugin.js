import path from 'path';
import fastifyStatic from '@fastify/static';
import Pug from 'pug';
import i18next from 'i18next';
import fastifyView from '@fastify/view';
import fastifyFormbody from '@fastify/formbody';
import fastifyMethodOverride from 'fastify-method-override';
import fastifyObjectionjs from 'fastify-objectionjs';
import { fileURLToPath } from 'url';
// NOTE plugin doesnt work properly: throws an error about route already been registered,
// even though the route has an unique name and hasn`t been registered before
// import { plugin as fastifyReverseRoutes } from 'fastify-reverse-routes';
// NOTE latest v.4 doesnt work with fastufy 4
// import flash from '@fastify/flash';
import fastifyPassport from '@fastify/passport';
import fastifySensible from '@fastify/sensible';
import qs from 'qs';
import dotenv from 'dotenv';
import fastifySecureSession from '@fastify/secure-session';
import fastifyCors from '@fastify/cors';
import FormStrategy from './lib/passportStrategies/FormStrategy.js';
import * as knexConfig from '../knexfile.js';
import models from './models/index.js';
import ru from './locales/ru.js';
import en from './locales/en.js';
import addRoutes from './routes/index.js';
import getHelpers from './helpers/index.js';

dotenv.config();

const __dirname = fileURLToPath(path.dirname(import.meta.url));

const mode = process.env.NODE_ENV || 'development';
// const isDevelopment = mode === 'development';

const setUpViews = (app) => {
  const helpers = getHelpers(app);
  app.register(fastifyView, {
    engine: {
      pug: Pug,
    },
    includeViewExtension: true,
    defaultContext: {
      ...helpers,
      assetPath: (filename) => `/assets/${filename}`,
      app, // add app to template contex, so we can use href=app.reverse in pug
    },
    templates: path.join(__dirname, '..', 'server', 'views'),
  });

  app.decorateReply('render', function render(viewPath, locals) {
    this.view(viewPath, { ...locals, reply: this });
  });
};

const setUpStaticAssets = (app) => {
  const pathPublic = path.join(__dirname, '..', 'dist');
  app.register(fastifyStatic, {
    root: pathPublic,
    prefix: '/assets/',
  });
};

const setupLocalization = async () => {
  await i18next.init({
    lng: 'ru',
    fallbackLng: 'en',
    // debug: true,
    // debug: isDevelopment,
    resources: {
      ru,
      en,
    },
  });
};

const addHooks = (app) => {
  app.addHook('preHandler', async (req, reply) => {
    reply.locals = {
      isAuthenticated: () => req.isAuthenticated(),
    };
  });

  app.addHook('onRequest', (req, reply, done) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    done();
  });
};

const registerPlugins = async (app) => {
  await app.register(fastifySensible);
  app.register(fastifyCors, {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  });
  // await app.register(fastifyErrorPage);
  // await app.register(fastifyReverseRoutes);
  await app.register(fastifyFormbody, { parser: qs.parse });
  await app.register(fastifySecureSession, {
    secret: process.env.SESSION_KEY,
    cookie: {
      path: '/',
      //
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    },
  });

  fastifyPassport.registerUserDeserializer((user) =>
    app.objection.models.user.query().findById(user.id)
  );
  fastifyPassport.registerUserSerializer((user) => Promise.resolve(user));
  fastifyPassport.use(new FormStrategy('form', app));
  await app.register(fastifyPassport.initialize());
  await app.register(fastifyPassport.secureSession());
  await app.decorate('fp', fastifyPassport);
  app.decorate('authenticate', (...args) =>
    fastifyPassport.authenticate(
      'form',
      {
        failureRedirect: app.reverse('root'),
        // failureFlash: i18next.t('flash.authError'),
      }
      // @ts-ignore
    )(...args)
  );

  await app.register(fastifyMethodOverride);
  await app.register(fastifyObjectionjs, {
    knexConfig: knexConfig[mode],
    models,
  });

  // temp solution that is used instead of reverse-routes
  app.decorate('reverse', (routeName) => {
    const routes = {
      root: '/',
      newUser: '/users/new',
      newSession: '/session/new',
    };
    return routes[routeName] || '/';
  });
};

export const options = {
  exposeHeadRoutes: false,
};

// eslint-disable-next-line no-unused-vars
export default async (app, _options) => {
  await registerPlugins(app);

  await setupLocalization();
  setUpViews(app);
  setUpStaticAssets(app);
  console.log('Перед регистрацией маршрутов:', app.printRoutes());
  await addRoutes(app);
  console.log('После регистрации маршрутов:', app.printRoutes());
  addHooks(app);

  return app;
};
