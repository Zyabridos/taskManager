'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import routes from '../../routes';
import LanguageSwitcher from '../LanguageSwitcher';
import { NAVBARHEIGHT } from './Navbar';

const baseURL = 'http://localhost:3000';

interface GuestNavbarProps {
  // This component does not accept any props, but you can extend this if needed
}

const GuestNavbar: React.FC<GuestNavbarProps> = () => {
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
          <Link href={`${baseURL}${routes.app.session.new()}`} className={linkClasses}>
            {t('navbar.signIn')}
          </Link>
          <Link href={`${baseURL}${routes.app.users.create()}`} className={linkClasses}>
            {t('navbar.signUp')}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default GuestNavbar;
