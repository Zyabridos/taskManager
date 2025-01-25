import React from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from './Navbar';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="card-body p-5">
      <div className="display-4 fw-bold mb-0">{t('views.welcome.hello')}</div>
      <p className="lead">{t('views.welcome.description')}</p>
      <a className="btn btn-primary btn-lg px-4 mt-3 fw-bold" href="https://github.com/Zyabridos/taskManager" target="_blank">{t('views.welcome.more')}</a>
    </div>
  );
};

export default Home;