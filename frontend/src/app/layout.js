'use client';

import './globals.css';
import { Provider } from 'react-redux';
import store from '../store/index';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n/i18n';
import Navbar from '../components/Navbar/Navbar';
import AuthProvider from '../context/authContex';
import { Toaster } from 'sonner';
import Footer from '../components/Footer';

const RootLayout = ({ children }) => {
  return (
    <html lang="ru">
      <body className="flex min-h-screen flex-col">
        <Provider store={store}>
          <AuthProvider>
            <I18nextProvider i18n={i18n}>
              <Navbar />
              <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
              <main className="flex-grow">{children}</main>
              <Footer />
            </I18nextProvider>
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;
