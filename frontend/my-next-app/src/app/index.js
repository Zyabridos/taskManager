"use client";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '@/components/Navbar';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n/i18n';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="container wrapper flex-grow-1">
        <h1 className="my-4">{t('welcome')}</h1>
      </main>
      <footer className="bg-dark text-light">
        <div className="container py-3 d-flex align-items-center">
          <p className="lead mb-0">Nina Zyabrina</p>
          <a className="ms-3 text-white" target="_blank" href="https://github.com/zyabridos" rel="noopener noreferrer">
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
