import React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import NavbarButtons from './Buttons/Buttons';

const Navbar = () => {
  const isAuthenticated = () => {
  // Заглушка для проверки аутентификации (замени на реальную логику)
  return false;
};


  const { t } = useTranslation();

  return (
      <header>
          <nav className="navbar navbar-expand-lg navbar-light bg-light mb-3">
            <div className="container">
              <a className="navbar-brand" href="/">Менеджер задач</a>
                <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarToggleExternalContent">
                  <span className="navbar-toggler-icon"></span>
                </button>
              <div className="collapse navbar-collapse" id="navbarToggleExternalContent">
                <NavbarButtons />
              </div>
            </div>
          </nav>
        </header>
  );
};

export default Navbar;