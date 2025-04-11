'use client';

import React from 'react';
import { useAuth } from '../../context/authContex';
import LoggedInNavbar from './LoggedInNavbar';
import GuestNavbar from './GuestNavbar';

export const NAVBARHEIGHT = 70;

interface AuthContextType {
  isAuthenticated: boolean;
}

const Navbar: React.FC = () => {
  const { isAuthenticated }: AuthContextType = useAuth();

  return isAuthenticated ? <LoggedInNavbar /> : <GuestNavbar />;
};

export default Navbar;
