import i18next from "i18next";

export default (app) => {
  app
    .get("/session/new", { name: "newSession" }, (req, reply) => {
      const signInForm = {};
      return reply.render("session/new", { signInForm });
    })

    .post(
      "/session",
      { name: "session" },
      app.fp.authenticate("form", async (req, reply, err, user) => {
        if (err) {
          req.flash("error", i18next.t("flash.session.create.error"));
          return reply.status(500).send({ error: "Internal Server Error" });
        }

        if (!user) {
          const signInForm = req.body.data;
          const errors = {
            email: [{ message: i18next.t("error.wrongEmailOrPassword") }],
          };
          req.flash("error", i18next.t("flash.session.create.failure"));
          return reply
            .status(401)
            .render("session/new", { signInForm, errors });
        }

        await req.logIn(user);
        req.session.userId = user.id;
        req.flash("success", i18next.t("flash.session.create.success"));

        return reply.redirect("/");
      }),
    )

    .delete("/session", async (req, reply) => {
      await req.logOut();
      req.flash("info", i18next.t("flash.session.delete.success"));
      return reply.redirect("/");
    });
};
