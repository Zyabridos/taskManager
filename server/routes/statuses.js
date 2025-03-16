import i18next from "i18next";

export default (app) => {
  app
    // GET /statuses - list of all statuses
    .get("/statuses", { name: "statuses" }, async (req, reply) => {
      const statuses = await app.objection.models.status.query();
      reply.render("statuses/index", { statuses });
      return reply;
    })

    // GET /statuses/new - page for creating new status
    .get("/statuses/new", { name: "newStatus" }, (req, reply) => {
      const status = new app.objection.models.status();
      reply.render("statuses/new", { status });
    })

    // GET /statuses/:id/edit - page for editing a status
    .get("/statuses/:id/edit", { name: "editStatus" }, async (req, reply) => {
      const { id } = req.params;
      try {
        const status = await app.objection.models.status.query().findById(id);
        if (!status) {
          req.flash("error", i18next.t("flash.status.edit.notFound"));
          reply.status(404).send("Status not found");
          return;
        }
        console.log("Status data:", status);
        reply.render("statuses/edit", { status, errors: {} });
      } catch ({ data }) {
        reply.render("statuses/edit", { errors: data });
        req.flash("error", i18next.t("flash.statuses.edit.error"));
        reply.status(500).send("Internal Server Error");
      }
      return reply;
    })

    // POST /statuses - create new status
    .post("/statuses", { name: "createStatus" }, async (req, reply) => {
      const status = new app.objection.models.status();

      try {
        const validStatus = await app.objection.models.status.fromJson(
          req.body.data,
        );
        await app.objection.models.status.query().insert(validStatus);
        req.flash("info", i18next.t("flash.statuses.create.success"));
        reply.redirect("/statuses");
      } catch ({ data }) {
        req.flash("error", i18next.t("flash.statuses.create.error"));
        reply.render("statuses/new", { status, errors: data });
      }

      return reply;
    })

    // PATCH /statuses/:id - edit a status
    .patch("/statuses/:id", { name: "updateStatus" }, async (req, reply) => {
      const { id } = req.params;
      const updatedData = req.body.data;
      try {
        const status = await app.objection.models.status.query().findById(id);
        if (!status) {
          req.flash("error", i18next.t("flash.statuses.edit.notFound"));
          return reply.status(404).send("Status not found");
        }
        await status.$query().patch(updatedData);
        req.flash("info", i18next.t("flash.statuses.edit.success"));
        reply.redirect(`/statuses`);
      } catch ({ data }) {
        req.flash("error", i18next.t("flash.statuses.edit.error"));
        reply.render("statuses/edit", {
          status: { id, ...updatedData },
          errors: data,
        });
      }
    })

    // DELETE /statuses/:id - delete a status
    .delete("/statuses/:id", { name: "deleteStatus" }, async (req, reply) => {
      const { id } = req.params;
      try {
        const status = await app.objection.models.status
          .query()
          .findById(id)
          .withGraphFetched("tasks");

        if (!status) {
          req.flash("error", i18next.t("flash.statuses.delete.notFound"));
          return reply.status(404).send("Status not found");
        }
        if (status.tasks.length > 0) {
          req.flash("error", i18next.t("flash.labels.delete.hasTasks"));
          return reply.redirect("/statuses");
        }
        await status.$query().delete();
        req.flash("info", i18next.t("flash.statuses.delete.success"));
        return reply.redirect("/statuses");
      } catch (error) {
        req.flash("error", i18next.t("flash.statuses.delete.error"));
        return reply.status(500).send("Internal Server Error");
      }
    });
};
