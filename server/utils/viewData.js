export const commonViewData = (req, t) => ({
  navBar: {
    taskManager: t('Менеджер задач'),
    users: t('Пользователи'),
    signIn: t('Вход'),
    createAccount: t('Регистрация'),
  },
});

export const formViewData = (req, t, formType) => ({
  ...commonViewData(req, t),
  users: {
    navBar: {
      taskManager: t('Менеджер задач'),
      users: t('Пользователи'),
      signIn: t('Вход'),
      createAccount: t('Регистрация'),
    },
    [formType]: {
      firstName: t('Имя'),
      lastName: t('Фамилия'),
      email: t('Email'),
      password: t('Пароль'),
      submit: formType === 'new' ? t('Зарегистрироваться') : t('Сохранить изменения'),
      firstNamePlaceholder: t('Введите ваше имя'),
      lastNamePlaceholder: t('Введите вашу фамилию'),
      emailPlaceholder: t('Введите ваш email'),
      passwordPlaceholder: t('Введите ваш новый пароль'),
    },
  },
});
