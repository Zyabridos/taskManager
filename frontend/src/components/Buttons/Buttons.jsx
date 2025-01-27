'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher';

const NavbarButtons = () => {
  const { t } = useTranslation();
  return (
    <ul className="flex items-center space-x-6">
      <li>
        <Link
          href="/session/new"
          className="text-lg text-gray-700 hover:text-gray-900 transition"
        >
          {t('layouts.application.signIn')}
        </Link>
      </li>
      <li>
        <Link
          href="/users/new"
          className="text-lg text-gray-700 hover:text-gray-900 transition"
        >
          {t('layouts.application.signUp')}
        </Link>
      </li>
      <li>
        <LanguageSwitcher />
      </li>
    </ul>
  );
};

export default NavbarButtons;
