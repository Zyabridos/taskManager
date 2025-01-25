import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from './i18n/i18n.js';
import { I18nextProvider } from 'react-i18next';

const isAuthenticated = () => {
  // Заглушка для проверки аутентификации (замени на реальную логику)
  return false;
};

const App = () => {
  const { t } = useTranslation();

  return (
    <I18nextProvider i18n={i18n}>
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <header>
          <nav className="navbar navbar-expand-lg navbar-light bg-light mb-3">
            <div className="container-fluid">
              <Link className="navbar-brand" to="/">
                {t('appName')}
              </Link>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarToggleExternalContent"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarToggleExternalContent">
                <div className="container-fluid">
                  <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                      <Link className="nav-link" to="/users">
                        {t('layouts.application.users')}
                      </Link>
                    </li>
                  </ul>
                  <ul className="navbar-nav">
                    {isAuthenticated() ? (
                      <li className="nav-item">
                        <form action="/session" method="POST">
                          <button type="submit" className="btn nav-link">
                            {t('layouts.application.signOut')}
                          </button>
                        </form>
                      </li>
                    ) : (
                      <>
                        <li className="nav-item">
                          <Link className="nav-link" to="/login">
                            {t('layouts.application.signIn')}
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link className="nav-link" to="/register">
                            {t('layouts.application.signUp')}
                          </Link>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </nav>
        </header>

        <main className="container wrapper flex-grow-1">
          <h1 className="my-4"> {/* Блок заголовка */}
            {/* Можно вставить динамический заголовок */}
          </h1>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
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
    </Router>
    </I18nextProvider>
  );
};

// Заглушки для страниц
const Home = () => <h2>Home Page</h2>;
// UserList потом подставить
const Users = () => <h2>Users Page</h2>;
const Login = () => <h2>Login Page</h2>;
const Register = () => <h2>Register Page</h2>;

export default App;