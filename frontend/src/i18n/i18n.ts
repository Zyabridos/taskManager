import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ru from './locales/ru/index.js';
import en from './locales/en/index.js';
import no from './locales/no/index.js';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    resources: {
      ru,
      en,
      no,
    },
    ns: Object.keys(ru),
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    pluralSeparator: '_',
    detection: {
      order: ['localStorage'],
      caches: ['localStorage'],
    },
  });

export default i18n;
