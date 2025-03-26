'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import routes from '../routes';

const Navbar = () => {
  const { t } = useTranslation('common');
  const linkClasses =
    'rounded-md px-3 py-2 text-xl font-medium text-gray-300 hover:bg-gray-700 hover:text-white';

  return (
    <nav className="h-18 bg-gray-800">
      <div className="flex h-full items-center justify-between px-4">
        <div className="flex space-x-4">
          <Link href="/" className={linkClasses}>
            {t('navbar.appName')}
          </Link>
          <Link href={routes.users.list} className={linkClasses}>
            {t('navbar.users')}
          </Link>
        </div>

        <div className="flex space-x-4">
          <Link href={routes.session.new} className={linkClasses}>
            {t('navbar.signIn')}
          </Link>
          <Link href={routes.users.create} className={linkClasses}>
            {t('navbar.signUp')}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
