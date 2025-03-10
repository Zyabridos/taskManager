import i18next from "i18next";

export default (app) => {
  app
    .get("/session/new", { name: "newSession" }, (req, reply) => {
      const signInForm = {};
      reply.render("session/new", { signInForm });
    })
    .post(
      "/session",
      { name: "session" },
      app.fp.authenticate("form", async (req, reply, err, user) => {
        if (err) {
          return app.httpErrors.internalServerError(err);
        }
        if (!user) {
          const signInForm = req.body.data;
          const errors = {
            email: [{ message: i18next.t("errors.wrongEmailOrPassword") }],
          };
          reply.render("session/new", { signInForm, errors });
          return reply.status(401);
        }
        await req.logIn(user);
        req.session.userId = user.id;
        reply.redirect("/");
        return reply;
      }),
    )

    .delete("/session", async (req, reply) => {
      await req.logOut();
      req.flash("info", i18next.t("flash.session.delete.success"));
      return reply.redirect("/");
    });
};
