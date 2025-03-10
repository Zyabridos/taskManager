export default {
  translation: {
    appName: "Task Manager",
    flash: {
      session: {
        create: {
          success: "You are logged in",
          error: "Invalid email or password",
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
          hasTasks: "Cannot delete user as they are assigned to a task",
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
          hasTasks: "Cannot delete label as it is used in tasks.",
        },
      },
      authError: "Access denied! Please sign in.",
    },
    layouts: {
      application: {
        users: "Users",
        statuses: "Statuses",
        tasks: "Tasks",
        labels: "Labels",
        signIn: "Sign In",
        signUp: "Sign Up",
        signOut: "Sign Out",
        language: "Change language",
      },
    },
    views: {
      session: {
        new: {
          signIn: "Sign In",
          submit: "Log In",
          email: "Email",
          password: "Password",
        },
      },
      users: {
        title: "Users",
        id: "ID",
        fullName: "Full Name",
        email: "Email",
        createdAt: "Created At",
        actions: "Actions",
        editBtn: "Edit",
        delete: "Delete",
        firstName: "First Name",
        lastName: "Last Name",
        password: "Password",
        new: {
          header: "Sign Up",
          submit: "Save",
          signUp: "Sign Up",
        },
        edit: {
          title: "Edit User",
          submit: "Save Changes",
        },
      },
      statuses: {
        title: "Statuses",
        createStatusBtn: "Create Status",
        id: "ID",
        name: "Name",
        createdAt: "Created At",
        actions: "Actions",
        editBtn: "Edit",
        delete: "Delete",
        statusForm: {
          name: "Name",
        },
        new: {
          title: "Create Status",
          submit: "Create",
          label: "Enter status name",
        },
        edit: {
          title: "Edit Status",
          submit: "Edit",
          label: "Enter status name",
        },
      },
      tasks: {
        title: "Tasks",
        createTaskBtn: "Create Task",
        id: "ID",
        name: "Name",
        status: "Status",
        author: "Author",
        executor: "Executor",
        createdAt: "Created At",
        actions: "Actions",
        editBtn: "Edit",
        delete: "Delete",
        label: "Label",
        labels: "Labels",
        description: "Description",
        filter: "Filter",
        tasksForm: {
          name: "Name",
        },
        isUserCreator: "Only my tasks",
        noExecutors:
          "The user list is empty, so there is no one to assign this task to :)",
        new: {
          title: "Create Task",
          submit: "Create",
        },
        edit: {
          title: "Edit Task",
          submit: "Edit",
        },
      },
      labels: {
        title: "Labels",
        createLabelBtn: "Create Label",
        id: "ID",
        name: "Name",
        createdAt: "Created At",
        actions: "Actions",
        editBtn: "Edit",
        delete: "Delete",
        new: {
          title: "Create Label",
          submit: "Create",
        },
        edit: {
          title: "Edit Label",
          submit: "Edit",
        },
      },
      welcome: {
        index: {
          hello: "Hello from Nina!",
          description: "A hands-on project with Fastify",
          more: "Learn More",
        },
      },
    },
    errors: {
      wrongEmailOrPassword: "Invalid email or password",
    },
  },
};
