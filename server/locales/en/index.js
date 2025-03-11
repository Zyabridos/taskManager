import flash from "./flash.js";
import layouts from "./layouts.js";
import errors from "./errors.js";
import session from "./views/session.js";
import users from "./views/users.js";
import statuses from "./views/statuses.js";
import tasks from "./views/tasks.js";
import labels from "./views/labels.js";
import welcome from "./views/welcome.js";

export default {
  translation: {
    appName: "Task Manager",
    flash,
    layouts,
    errors,
    views: {
      session,
      users,
      statuses,
      tasks,
      labels,
      welcome,
    },
  },
};
