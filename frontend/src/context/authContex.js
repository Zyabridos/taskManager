'use client';

import axios from 'axios';
import React, { createContext, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import routes from '../routes.js';

export const AuthContext = createContext();

// const baseURL = `${process.env.NEXT_PUBLIC_API_BASE}/api`;
const baseURL = 'http://localhost:5001/api';

const AuthProvider = ({ children }) => {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [serverError, setServerError] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        // routes.loginPath,
        // '/session',
        `${baseURL}/session`,
        {
          data: {
            email,
            password,
          },
        },
        {
          withCredentials: true,
        }
      );

      console.log('server response on trying to log in:', response)

      setUser(response.data.user || { email });
      setIsAuthenticated(true);
      setServerError(null);
      router.push('/');
      alert('You have successfully logged in')
    } catch (error) {
      console.log(error)
      setIsAuthenticated(false);
      if (error.response?.status === 401) {
        setServerError('Woring Email or Password');
      } else {
        setServerError('Server error. Please, try again later.');
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      // logout,
      serverError,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
