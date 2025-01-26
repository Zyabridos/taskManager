"use client";
import React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const NavbarButtons = () => {
  // const { t } = useTranslation();
  return (
    <ul className="navbar-nav justify-content-end w-100">
      <li className="nav-item me-auto">
        <Link className="nav-link" to="/users">
          {/* {t('layouts.application.users')} */}
          aaa
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/login">
          {/* {t('layouts.application.signIn')} */}
          bbb
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/register">
          {/* {t('layouts.application.signUp')} */}
          ccc
        </Link>
      </li>
    </ul>
  )
}

export default NavbarButtons