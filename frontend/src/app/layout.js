'use client';

import './globals.css';
import { Provider } from 'react-redux';
import store from '../store/index.js';

import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n/i18n.js';

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className="h-24">
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
        </Provider>
      </body>
    </html>
  );
}
