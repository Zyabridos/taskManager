'use client';

import './globals.css';
import { Provider } from 'react-redux';
import store from '../store/index.js';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="h-24">
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}
