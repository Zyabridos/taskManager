import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from './i18n/i18n.js';
import { I18nextProvider } from 'react-i18next';
import Home from './components/Home.jsx';
import Navbar from './components/Navbar.jsx';
import UsersList from './components/UserList.jsx';
import LoginForm from './components/Forms/LoginForm.jsx';

const App = () => {
  const { t } = useTranslation();

  return (
    <I18nextProvider i18n={i18n}>
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="container wrapper flex-grow-1">
          <h1 className="my-4"> {/* Блок заголовка */}
            {/* Можно вставить динамический заголовок */}
          </h1>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/login" element={<LoginForm />} />
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
// const Users = () => <h2>Users Page</h2>;
const Login = () => <h2>Login Page</h2>;
const Register = () => <h2>Register Page</h2>;

export default App;