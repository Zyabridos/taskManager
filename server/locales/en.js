export default {
  translation: {
    appName: 'Task Manager',
    layouts: {
      application: {
        users: 'Users',
        signIn: 'Sign In',
        signUp: 'Sign Up',
      },
    },
    views: {
      welcome: {
        index: {
          hello: 'Hello from Nina!',
          description: 'Welcome to my Fastify project!',
        },
      },
      login: {
        title: 'Login',
        email: 'Email',
        password: 'Password',
        submit: 'Log in',
        error: {
          invalidCredentials: 'Invalid email or password.',
          missingFields: 'Please fill in all fields.',
        },
      },
      mainPage: {
        title: 'Task Manager',
        taskManager: 'Task Manager',
        users: 'Users',
        status: 'Statuses',
        labels: 'Labels',
        tasks: 'Tasks',
        exit: 'Log out',
        changeLanguage: 'Change language to English',
        welcomeCard: {
          title: 'Hello!',
          message: 'Welcome to the task manager - a practical project on Fastify',
          button: 'Learn more',
        },
      },
      users: {
        title: 'Task Manager',
        navBar: {
          taskManager: 'Task Manager',
          users: 'Users',
          signIn: 'Sign In',
          createAccount: 'Register',
        },
        table: {
          title: 'Users',
          id: 'ID',
          fullName: 'Full Name',
          email: 'Email',
          createdAt: 'Creation Date',
          actions: 'Actions',
        },
        new: {
          title: 'Registration',
          firstName: 'First Name',
          lastName: 'Last Name',
          email: 'Email',
          password: 'Password',
          submit: 'Register',
          firstNamePlaceholder: 'Enter your first name',
          lastNamePlaceholder: 'Enter your last name',
          emailPlaceholder: 'Enter your email',
          passwordPlaceholder: 'Enter your password',
        },
        edit: {
          title: 'Edit User',
          firstName: 'First Name',
          lastName: 'Last Name',
          email: 'Email',
          password: 'Password',
          submit: 'Save Changes',
          firstNamePlaceholder: 'Enter your first name',
          lastNamePlaceholder: 'Enter your last name',
          emailPlaceholder: 'Enter your email',
          passwordPlaceholder: 'Enter your new password',
        },
      },
    },
    title: 'Home Page',
    message: 'Welcome to our service!',
  },
};
