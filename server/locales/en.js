export default {
  translation: {
    appName: "Task Manager",
    flash: {
      labels: {
        create: {
          success: "Label successfully created",
          error: "Failed to create label",
        },
        update: {
          success: "Label successfully updated",
          error: "Failed to update label",
        },
        delete: {
          success: "Label successfully deleted",
          error: "Failed to delete label",
          hasTasks: "This label is attached to a task, so it cannot be deleted",
        },
      },
      tasks: {
        create: {
          success: "Task successfully created",
          error: "Failed to create task",
        },
        delete: {
          success: "Task successfully deleted",
          error: "Failed to delete task",
          noAccess: "Only the author can delete this task",
        },
        update: {
          success: "Task successfully updated",
          error: "Failed to update task",
        },
      },
      statuses: {
        create: {
          success: "Status successfully created",
          error: "Failed to create status",
        },
        update: {
          success: "Status successfully updated",
          error: "Failed to update status",
        },
        delete: {
          success: "Status successfully deleted",
          error: "Failed to delete status",
          hasTasks: "This status is attached to a task, so it cannot be deleted",
        },
      },
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
          error: "Failed to delete user",
          success: "User successfully deleted",
          noAccess: "You cannot edit or delete another user",
          hasTasks: "This user has a task, so they cannot be deleted",
        },
        update: {
          error: "Failed to update user",
          success: "User successfully updated",
        },
        edit: {
          noAcess: "You cannot edit or delete another user",
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
        language: "Change Language",
      },
      english: "English",
      russian: "Russian",
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
          header: "Registration",
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
          submit: "Update",
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
        noExecutors: "The user list is empty, so there's no one to assign this task to :)",
        new: {
          title: "Create Task",
          submit: "Create",
        },
        edit: {
          title: "Edit Task",
          submit: "Update",
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
          label: "Enter label name",
        },
        edit: {
          title: "Edit Label",
          submit: "Update",
          label: "Enter label name",
        },
      },
      welcome: {
        index: {
          hello: "Hello from Nina!",
          description: "A practical project on Fastify",
          more: "Learn More",
        },
      },
    },
    errors: {
      wrongEmailOrPassword: "Invalid email or password",
    },
  },
};
