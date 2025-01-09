export default async (app) => {
  app.get('/add-flash', (req, reply) => {
    const flashMessages = req.flash(); 
    return reply.view('./server/views/temp.pug', { flashMessages });
  });

  app.post('/add-flash', (req, reply) => {
    req.flash('success', 'Flash сообщение успешно добавлено!');
    req.flash('info', 'Это информационное сообщение.');
    req.flash('warning', 'Произошла ошибка.');
    return reply.redirect('/add-flash'); 
  });
};