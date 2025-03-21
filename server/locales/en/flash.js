export default {
  session: {
    create: {
      success: "You are logged in",
      error: "Incorrect email or password",
    },
    delete: {
      success: "You are logged out",
    },
  },
  users: {
    create: {
      error: "Failed to register",
      success: "User successfully registered",
    },
    delete: {
      success: "User successfully deleted",
      error: "Error deleting user.",
      notFound: "User not found.",
      hasTasks: "Cannot delete the user because they are assigned to a task",
    },
  },
  statuses: {
    create: {
      error: "Failed to create status",
      success: "Status successfully created",
    },
    delete: {
      success: "Status successfully deleted!",
      error: "Error deleting status.",
      notFound: "Status not found.",
    },
  },
  tasks: {
    create: {
      error: "Failed to create task",
      success: "Task successfully created",
    },
    delete: {
      success: "Task successfully deleted!",
      error: "Error deleting task.",
      notFound: "Task not found.",
    },
  },
  labels: {
    create: {
      error: "Failed to create label",
      success: "Label successfully created",
    },
    delete: {
      success: "Label successfully deleted!",
      error: "Error deleting label.",
      notFound: "Label not found.",
      hasTasks: "Cannot delete the label because it is used in tasks.",
    },
  },
  authError: "Access denied! Please log in.",
};
