'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import arrowDown from '../../public/arrow_down.svg';

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
  { code: 'no', label: 'NO' },
];

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = i18n.language.slice(0, 2).toUpperCase();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-xl font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
      >
        {currentLang}
        <Image src={arrowDown} alt="Toggle language dropdown" width={16} height={16} />
      </button>

      {isOpen && (
        <div className="ring-opacity-5 absolute right-0 z-10 mt-2 w-28 origin-top-right rounded-md bg-gray-800 shadow-lg ring-1 ring-black">
          <div className="py-1">
            {languages.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => changeLanguage(code)}
                className="block w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
