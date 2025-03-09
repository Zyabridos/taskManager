import i18next from "i18next";

export default (app) => {
  app
    // GET /tasks - list of all tasks
    .get("/tasks", { name: "tasks" }, async (req, reply) => {
      const { status, executor, isCreatorUser, onlyExecutorTasks, label } =
        req.query;

      try {
        const statuses = await app.objection.models.status.query();
        const executors = await app.objection.models.user.query();
        const labels = await app.objection.models.label.query();

        const query = app.objection.models.task
          .query()
          .withGraphJoined("[status, executor, author, labels]")
          .select(
            "tasks.*",
            "status.name as statusName",
            "executor.firstName as executorFirstName",
            "executor.lastName as executorLastName",
            "author.firstName as authorFirstName",
            "author.lastName as authorLastName",
          );

        const statusId = Number(status);
        if (statusId) {
          query.where("tasks.status_id", statusId);
        }

        const executorId = Number(executor);
        if (executorId) {
          query.where("tasks.executor_id", executorId);
        }

        if (isCreatorUser === "true") {
          query.where("tasks.author_id", req.session.userId);
        }

        if (onlyExecutorTasks === "true") {
          query.where("tasks.executor_id", req.session.userId);
        }

        const labelId = Number(label);
        if (labelId) {
          query.where("labels.id", labelId);
        }

        const tasks = await query;
        console.log(query);
        reply.render("tasks/index", {
          tasks,
          statuses,
          executors,
          labels,
          query: req.query || {},
          selectedStatus: status || "",
          selectedExecutor: executor || "",
          selectedLabel: label || "",
          isCreatorUser: isCreatorUser === "true",
          onlyExecutorTasks: onlyExecutorTasks === "true",
        });

        console.log("Filtered tasks: ", tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        reply.code(500).send({ error: "Internal Server Error" });
      }

      return reply;
    })

    // GET /tasks/new - page for creating new task
    .get("/tasks/new", { name: "newTask" }, async (req, reply) => {
      try {
        const task = new app.objection.models.task();
        const statuses = await app.objection.models.status.query();
        const users = await app.objection.models.user.query();
        const labels = await app.objection.models.label.query();

        reply.render("tasks/new", {
          task,
          statuses: statuses || [],
          users: users || [],
          labels: labels || [],
          errors: {},
        });

        return reply;
      } catch (error) {
        console.error("Error fetching data for new task:", error);
        req.flash("error", i18next.t("flash.tasks.create.error"));
        return reply.status(500).send("Internal Server Error");
      }
    })

    // GET /tasks/:id - view particular task
    .get(
      "/tasks/:id",
      { name: "task", preValidation: app.authenticate },
      async (req, reply) => {
        const taskId = Number(req.params.id);
        const task = await app.objection.models.task
          .query()
          .findById(taskId)
          .withGraphFetched("[status, executor, author, labels]"); // снова загружаем связанный с таском данные

        reply.render("tasks/task", { task });
        return reply;
      },
    )

    .get("/tasks/:id/edit", { name: "editTask" }, async (req, reply) => {
      const { id } = req.params;

      try {
        const task = await app.objection.models.task
          .query()
          .findById(id)
          .withGraphFetched("[status, executor, labels]");

        if (!task) {
          req.flash("error", i18next.t("flash.tasks.edit.notFound"));
          return reply.status(404).send("Task not found");
        }

        const statuses = await app.objection.models.status.query();
        const users = await app.objection.models.user.query();
        const labels = await app.objection.models.label.query();

        reply.render("tasks/edit", {
          task,
          statuses: statuses || [],
          users: users || [],
          labels: labels || [],
          errors: {},
        });

        return reply;
      } catch (error) {
        console.error("Error fetching task:", error);
        req.flash("error", i18next.t("flash.tasks.edit.error"));
        return reply.status(500).send("Internal Server Error");
      }
    })

    // POST /tasks - create new task
    .post("/tasks", { name: "createTask" }, async (req, reply) => {
      console.log("Form data:", req.body);

      const { name, description, statusId, executorId, labels } = req.body.data;
      const { id: authorId } = req.user;

      // Преобразуем метки в массив чисел
      const labelIds = Array.isArray(labels)
        ? labels.map(Number)
        : [Number(labels)].filter((id) => !Number.isNaN(id));

      const taskData = {
        name,
        description,
        statusId: Number(statusId),
        executorId: Number(executorId),
        authorId: Number(authorId),
      };

      console.log("taskData: ", taskData);

      try {
        // Создаем задачу без labels
        const newTask = await app.objection.models.task
          .query()
          .insert(taskData);

        console.log("New Task Created:", newTask);

        // Добавляем связи в таблицу task_labels
        if (labelIds.length > 0) {
          await app.objection.models.task
            .relatedQuery("labels")
            .for(newTask.id)
            .relate(labelIds);
        }

        req.flash("info", i18next.t("flash.tasks.create.success"));
        reply.redirect("/tasks");
      } catch (error) {
        console.error("Error:", error);
        req.flash("error", i18next.t("flash.tasks.create.error"));
        const statuses = await app.objection.models.status.query();
        const executors = await app.objection.models.user.query();
        const availableLabels = await app.objection.models.label.query();

        reply.render("tasks/new", {
          task: taskData,
          statuses,
          executors,
          labels: availableLabels,
          errors: error.data || {},
        });
      }
      return reply;
    })

    // PATCH /tasks/:id - edit a task
    .patch("/tasks/:id", { name: "updateTask" }, async (req, reply) => {
      const { id } = req.params;
      const updatedData = req.body.data;

      updatedData.statusId = Number(updatedData.statusId);
      updatedData.executorId = Number(updatedData.executorId);

      try {
        const task = await app.objection.models.task.query().findById(id);

        if (!task) {
          req.flash("error", i18next.t("flash.tasks.edit.notFound"));
          return reply.status(404).send("Task not found");
        }

        await task.$query().patch(updatedData);
        req.flash("info", i18next.t("flash.tasks.edit.success"));
        return reply.redirect(`/tasks`);
      } catch (error) {
        console.error("Error updating task:", error);
        req.flash("error", i18next.t("flash.tasks.edit.error"));

        const statuses = await app.objection.models.status.query();
        const executors = await app.objection.models.user.query();
        const labels = await app.objection.models.label.query();

        return reply.render("tasks/edit", {
          task: { id, ...updatedData },
          statuses,
          executors,
          labels,
          errors: error.data || {},
        });
      }
    })

    // DELETE /tasks/:id - delete a task
    .delete("/tasks/:id", { name: "deleteStatus" }, async (req, reply) => {
      const { id } = req.params;
      try {
        const task = await app.objection.models.task.query().findById(id);
        if (!task) {
          req.flash("error", i18next.t("flash.tasks.delete.notFound"));
          return reply.task(404).send("Task not found");
        }
        await task.$query().delete();
        req.flash("info", i18next.t("flash.tasks.delete.success"));
        reply.redirect("/tasks");
      } catch (error) {
        req.flash("error", i18next.t("flash.tasks.delete.error"));
        return reply.status(500).send("Internal Server Error");
      }
    });
};
