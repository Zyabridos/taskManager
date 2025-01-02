export default async function changeLanguage(app, opts) {
  app.post('/change-language', (req, reply) => {
    const { language } = req.body;
    if (language) {
      req.i18n.changeLanguage(language); // Меняем язык через i18next
      reply.setCookie('i18next', language, { path: '/' }); // Сохраняем язык в cookies
    }
    reply.redirect('/'); // Перенаправляем на главную страницу
  });
}
