'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import routes from '../../routes';
import LanguageSwitcher from '../LanguageSwitcher';
import { useAuth } from '../../context/authContex';
import { NAVBARHEIGHT } from './Navbar';

const baseURL = 'http://localhost:3000';

const LoggedInNavbar = () => {
  const { logOut } = useAuth();
  const { t } = useTranslation('common');
  const linkClasses =
    'rounded-md px-3 py-2 text-xl font-medium text-gray-300 hover:bg-gray-700 hover:text-white';

  return (
    <nav style={{ height: `${NAVBARHEIGHT}px` }} className="bg-gray-800">
      <div className="flex h-full items-center justify-between px-4">
        <div className="flex space-x-4">
          <Link href="/" className={linkClasses}>
            {t('navbar.appName')}
          </Link>
          <Link href={`${baseURL}${routes.app.users.list()}`} className={linkClasses}>
            {t('navbar.users')}
          </Link>
        </div>

        <div className="flex space-x-4">
          <LanguageSwitcher />
          <Link href={`${baseURL}${routes.app.statuses.list()}`} className={linkClasses}>
            {t('navbar.statuses')}
          </Link>
          <Link href={`${baseURL}${routes.app.labels.list()}`} className={linkClasses}>
            {t('navbar.labels')}
          </Link>
          <Link href={`${baseURL}${routes.app.tasks.list()}`} className={linkClasses}>
            {t('navbar.tasks')}
          </Link>
          <button onClick={logOut} className={linkClasses}>
            {t('navbar.logOut')}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default LoggedInNavbar;
