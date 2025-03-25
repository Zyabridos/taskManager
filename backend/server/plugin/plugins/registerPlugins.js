import fastifyPlugin from 'fastify-plugin';
import fastifyFormbody from '@fastify/formbody';
import fastifyObjectionjs from 'fastify-objectionjs';
import fastifySecureSession from '@fastify/secure-session';
import fastifyCors from '@fastify/cors';
import fastifyPassport from '@fastify/passport';
import fastifySensible from '@fastify/sensible';
import fastifyMethodOverride from 'fastify-method-override';
import qs from 'qs';
import dotenv from 'dotenv';

import FormStrategy from '../../lib/passportStrategies/FormStrategy.js';
import * as knexConfig from '../../../knexfile.js';
import models from '../../models/index.js';

dotenv.config();

const registerPlugins = async (app) => {
  await app.register(fastifySensible);

  app.register(fastifyCors, {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  });

  await app.register(fastifyFormbody, { parser: qs.parse });

  await app.register(fastifySecureSession, {
    secret: process.env.SESSION_KEY,
    cookie: {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    },
  });

  await app.register(fastifyMethodOverride, {
    methods: ['POST'],
    query: '_method',
    body: true,
  });

  fastifyPassport.registerUserDeserializer(
    (user) => app.objection.models.user.query().findById(user.id),
  );
  fastifyPassport.registerUserSerializer((user) => Promise.resolve(user));
  fastifyPassport.use(new FormStrategy('form', app));

  await app.register(fastifyPassport.initialize());
  await app.register(fastifyPassport.secureSession());

  app.decorate('fp', fastifyPassport);
  app.decorate(
    'authenticate',
    (...args) => fastifyPassport.authenticate('form', {
      failureRedirect: app.reverse('root'),
    })(...args),
  );

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

export default fastifyPlugin(registerPlugins);
