'use client';

import React from 'react';
import { useAuth } from '../../context/authContex';
import LoggedInNavbar from './LoggedInNavbar';
import GuestNavbar from './GuestNavbar';

export const NAVBARHEIGHT = 70;

const Navbar = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <LoggedInNavbar /> : <GuestNavbar />;
};

export default Navbar;
