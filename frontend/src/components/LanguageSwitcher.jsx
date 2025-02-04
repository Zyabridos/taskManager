import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false); // закрыть меню после выбора языка
  };

  const languages = [
    { code: "en", label: "English", flag: "🇬🇧" },
    { code: "ru", label: "Русский", flag: "🇷🇺" },
    { code: "no", label: "Norsk", flag: "🇳🇴" },
  ];

  const selectedLanguage = languages.find(
    (lang) => lang.code === i18n.language,
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 border border-gray-400 rounded-lg bg-white text-gray-800 shadow-md hover:bg-gray-100 flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
      >
        <span className="text-2xl">{selectedLanguage?.flag}</span>
        <span className="uppercase">{selectedLanguage?.code}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded-lg shadow-lg">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className="flex items-center space-x-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => changeLanguage(lang.code)}
            >
              <span className="text-2xl">{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
