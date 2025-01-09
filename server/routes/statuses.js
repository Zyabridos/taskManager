import { formattedDate, formattedDateLocal } from '../utils/dateFormatters.js';

export default async (app, opts) => {
  const { db } = opts; // Получаем базу данных из опций
  app.get('/statuses', { name: 'statusesList ' }, async (req, reply) => {
    const flashMessages = req.flash();

    try {
      const statuses = await new Promise((resolve, reject) => {
        db.all('SELECT * FROM statuses', (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        });
      });
      console.log(statuses);
      return reply.view('./server/views/statuses/index.pug', {
        flashMessages,
        data: { users: statuses || [] },
      });
    } catch (error) {
      reply.status(500).send(error.message);
    }
  });

  app.post(
    '/statuses',
    { name: 'SOMENAMEorTooLateToThink' },
    async (req, reply) => {
      req.flash('info', 'Статус успешно создан');
      return reply.redirect('/statuses');
    }
  );
};
