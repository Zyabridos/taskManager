"use client";

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        taskManager: 'Task Manager',
        helloWorld: 'Hello, world!',
      },
    },
    ru: {
      translation: {
        taskManager: 'Менеджер задач',
        helloWorld: 'Привет, МИР!',
      },
    },
  },
  lng: 'ru',  // Установи нужный язык ('en', 'ru')
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
