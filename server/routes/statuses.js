import { formattedDate, formattedDateLocal } from '../utils/dateFormatters.js'

export default async (app) => {
  app.get('/statuses',  {name: 'statusesList '}, async (req, reply) => {
    const flashMessages = req.flash(); 
    return reply.view('./server/views/statuses/index.pug', { flashMessages })
  });

  app.post('/statuses', { name: 'SOMENAMEorTooLateToThink' }, async (req, reply) => {
    req.flash('info', 'Статус успешно создан');
    return reply.redirect('/statuses'); 
  });
}
