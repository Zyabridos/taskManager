import fastifyFormbody from '@fastify/formbody';
import fastifyObjectionjs from 'fastify-objectionjs';
import fastifySecureSession from '@fastify/secure-session';
import fastifyCors from '@fastify/cors';
import fastifyFlash from '@fastify/flash';
// NOTE plugin doesnt work properly: throws an error about route already been registered,
// even though the route has an unique name and hasn`t been registered before
// import { plugin as fastifyReverseRoutes } from 'fastify-reverse-routes';
import fastifyPassport from '@fastify/passport';
import fastifySensible from '@fastify/sensible';
import fastifyMethodOverride from 'fastify-method-override';
import qs from 'qs';
import dotenv from 'dotenv';
import FormStrategy from '../../lib/passportStrategies/FormStrategy.js';
import * as knexConfig from '../../../knexfile.js';
import models from '../../models/index.js';

// upload const .env в process.env
dotenv.config();

const registerPlugins = async (app) => {
  await app.register(fastifySensible);
  // fastifyCors settings
  app.register(fastifyCors, {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // await app.register(fastifyReverseRoutes);
  await app.register(fastifyFormbody, { parser: qs.parse });

  // register fastifySecureSession for secure sessions
  await app.register(fastifySecureSession, {
    secret: process.env.SESSION_KEY, // Ключ для шифрования сессионных данных
    cookie: {
      path: '/', // дать куки доступ для всего сайта
      httpOnly: true, // защита от XSS-атак - запрещает доступ к куки из JS
      secure: process.env.NODE_ENV === 'production', // Включает передачу куки только по HTTPS в продакшене
    },
  });

  // app.register(fastifyFlash);

  await app.register(fastifyMethodOverride, {
    methods: ['POST'], // Перехватываем только POST-запросы
    query: '_method', // Позволяет использовать _method в URL
    body: true, // Теперь Fastify ищет _method в body
  });

  // Passport Setting
  fastifyPassport.registerUserDeserializer((user) =>
    app.objection.models.user.query().findById(user.id)
  );
  fastifyPassport.registerUserSerializer((user) => Promise.resolve(user));
  fastifyPassport.use(new FormStrategy('form', app));

  await app.register(fastifyPassport.initialize());
  await app.register(fastifyPassport.secureSession());

  // decorators
  app.decorate('fp', fastifyPassport);
  app.decorate('authenticate', (...args) =>
    fastifyPassport.authenticate('form', {
      failureRedirect: app.reverse('root'),
    })(...args)
  );
  // change to fastify-reverse-routes evnt
  app.decorate('reverse', (routeName) => {
    const routes = {
      root: '/',
      newUser: '/users/new',
      newSession: '/session/new',
    };
    return routes[routeName] || '/';
  });

  await app.register(fastifyObjectionjs, {
    knexConfig: knexConfig[process.env.NODE_ENV || 'development'],
    models,
  });
};

export default registerPlugins;
