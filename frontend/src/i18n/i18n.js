// src/i18n/i18n.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 🔽 Импорты
import ru from './locales/ru/index.js';
import en from './locales/en/index.js';
import no from './locales/no/index.js';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'ru',
    resources: {
      ru: { translation: ru },
      en: { translation: en },
      no: { translation: no },
    },
    detection: {
      order: ['localStorage', 'navigator', 'cookie', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
