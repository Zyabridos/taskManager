'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaGithub, FaTelegram } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import Link from 'next/link';

const Footer: React.FC = () => {
  const { t } = useTranslation('common');
  const baseClasses =
    'rounded-md px-3 py-2 text-xl font-medium text-gray-300 hover:bg-gray-700 hover:text-white';

  return (
    <footer className="h-18 bg-gray-800 text-gray-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <p className={baseClasses}>{t('footer.name')}</p>
        <div className="flex gap-4">
          <Link
            href="https://github.com/zyabridos"
            target="_blank"
            className={`${baseClasses} flex items-center`}
          >
            {t('footer.github')} <FaGithub className="ml-2 text-2xl" />
          </Link>
          <Link
            href="https://t.me/zyabridos"
            target="_blank"
            className={`${baseClasses} flex items-center`}
          >
            {t('footer.telegram')} <FaTelegram className="ml-2 text-2xl" />
          </Link>
          <Link href="mailto:zyabrina95@gmail.com" className={`${baseClasses} flex items-center`}>
            {t('footer.email')} <HiOutlineMail className="ml-2 text-2xl" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
