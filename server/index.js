import path from 'path';
import fastifyView from 'point-of-view';
import fastifyStatic from '@fastify/static';
import pug from 'pug';
import i18next from 'i18next';
import middleware from 'i18next-http-middleware';
import fastifyFormbody from '@fastify/formbody';
import fastifyCookie from '@fastify/cookie';
import session from '@fastify/session';
import fastifyMethodOverride from 'fastify-method-override';
import fastifyObjectionjs from 'fastify-objectionjs';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
// import fastifyReverseRoutes from 'fastify-reverse-routes';
import * as knexConfig from '../knexfile.js';
import models from './models/index.js';
import ru from './locales/ru.js';
import en from './locales/en.js';
import userRoutes from './routes/users.js';
import sessionsRoutses from './routes/sessions.js';
import changeLanguage from './routes/index.js';
import prepareDatabase from './db/init.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const db = new sqlite3.Database(':memory:');
prepareDatabase(db);

export const setUpViews = (app) => {
  app.register(fastifyView, {
    engine: { pug },
    templates: path.join('./'),
  });
};

export const setUpStaticAssets = (app) => {
  app.register(fastifyStatic, {
    root: path.join(__dirname, '../public'),
    prefix: '/assets/',
  });
};

export const setupLocalization = async () => {
  await i18next.use(middleware.LanguageDetector).init({
    lng: 'en',
    fallbackLng: 'ru',
    resources: { ru, en },
    detection: { order: ['cookie', 'header'], caches: ['cookie'] },
  });
};

// register all plugins that we have imported
export const registerPlugins = async (app) => {
  // await app.register(fastifyReverseRoutes);
  app.register(middleware.plugin, { i18next });
  app.register(fastifyFormbody);
  app.register(fastifyCookie);
  app.register(session, {
    secret: 'a secret with minimum length of 32 characters',
    cookie: { secure: false },
  });
  await app.register(fastifyMethodOverride);
  await app.register(fastifyObjectionjs, {
    knexConfig: knexConfig[process.env.NODE_ENV || 'development'],
    models,
  });
};

// register custom routes
export const addRoutes = (app) => {
  console.log('Регистрация маршрутов начата...');
  app.register(sessionsRoutses, { db }, { prefix: '/session' });
  app.register(userRoutes, { db }, { prefix: '/users' });
  app.register(changeLanguage, { prefix: '/change-language' });
  console.log('Маршруты успешно зарегистрированы.');

  return app;
};

const init = async (app) => {
  await setupLocalization();
  await registerPlugins(app);
  setUpViews(app);
  setUpStaticAssets(app);
  addRoutes(app);
};

export default init;

//  git commit -m 'code refactoring; move routes to fastifyReverseRoutes'
