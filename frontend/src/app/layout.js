'use client';

import './globals.css';
import { Provider } from 'react-redux';
import store from '../store/index.js';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n/i18n.js';
import Navbar from '../components/Navbar/Navbar.jsx';
import AuthProvider from '../context/authContex.js';

const RootLayout = ({ children }) => {
  return (
    <html lang="ru">
      <body className="h-24">
        <Provider store={store}>
          <AuthProvider>
              <Navbar />
              <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;
