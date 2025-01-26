"use client";

import { useTranslation } from 'react-i18next';

const Temp = () => {
  const { t } = useTranslation();

  const isAuthenticated = () => {
    // Заглушка для проверки аутентификации (позже будет логика)
    return false;
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-3">
        <div className="container">
          <a className="navbar-brand" href="/">{t('taskManager')}</a>
          <button
            className="navbar-toggler"
            data-bs-toggle="collapse"
            data-bs-target="#navbarToggleExternalContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarToggleExternalContent">
            <h1>{t('helloWorld')}</h1>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Temp;
