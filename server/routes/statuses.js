import { formattedDate, formattedDateLocal } from '../utils/dateFormatters.js';
import { getStatusesFromDB } from '../utils/getDataFromDB.js';

export default async (app, opts) => {
  const { db } = opts; // Получаем базу данных из опций

  app.get('/statuses', { name: 'statusesList ' }, async (req, reply) => {
    const flashMessages = req.flash();

    try {
      const statuses = await getStatusesFromDB(db);
      console.log(`fetched statuses from DB: ${statuses}`);
      return reply.view('./server/views/statuses/index.pug', {
        flashMessages,
        data: { statuses: statuses || [] },
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

  app.get('/statuses/new', { name: 'statusesNew' }, async (req, reply) => reply.view('./server/views/statuses/new.pug', {
    }));

  app.post('/statuses/new', { name: 'SOMENAMEorTooLateToThink' }, async (req, reply) => {
  const formData = req.body;
  const statusName = formData['data[name]']?.trim();

  if (!statusName) {
    return reply.redirect('/statuses/new');
  }

  try {
    const status = {
      name: statusName,
      created_at: formattedDate,
      created_at_local_time: formattedDateLocal,
    };

    await new Promise((resolve, reject) => {
      const stmt = db.prepare(
        'INSERT INTO statuses (name, created_at, created_at_local_time) VALUES (?, ?, ?)'
      );
      stmt.run([status.name, status.created_at, status.created_at_local_time], (err) => {
        if (err) reject(err);
        else resolve();
      });
      stmt.finalize();
    });

    return reply.redirect('/statuses');
  } catch (error) {
    console.error('Error during posting new status:', error);
    return reply.redirect('/');
  }
});
};
