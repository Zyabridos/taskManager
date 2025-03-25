import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ru from './locales/ru/index.js';

const savedLanguage = 'ru'; // evnt will be taken from localStorage

i18n.use(initReactI18next).init({
  lng: savedLanguage,
  resources: {
    ru,
  },
  lng: savedLanguage,
  ns: Object.keys(ru),
  // will be evnt
  // fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  pluralSeparator: '_',
});

export default i18n;