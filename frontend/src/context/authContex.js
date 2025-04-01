'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  saveUserToStorage,
  getUserFromStorage,
  removeUserFromStorage,
} from '../utils/storage/authStorage';
import routes from '../routes';
import useEntityToast from '../hooks/useEntityToast';

export const AuthContext = createContext();

const baseURL = 'http://localhost:5001';

const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { showToast } = useEntityToast();

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(`${baseURL}${routes.api.session.current()}`, {
        withCredentials: true,
      });

      const currentUser = response.data.user;
      setUser(currentUser);
      setIsAuthenticated(true);
      saveUserToStorage(currentUser);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
      removeUserFromStorage();
    }
  };

  const login = async (email, password, isAfterRegistration = false) => {
    try {
      const response = await axios.post(
        `${baseURL}${routes.api.session.current()}`,
        { data: { email, password } },
        { withCredentials: true },
      );

      const loggedUser = response.data.user;
      setUser(loggedUser);
      setIsAuthenticated(true);
      setServerError(null);
      saveUserToStorage(loggedUser);

      showToast({
        type: 'user',
        action: isAfterRegistration ? 'registered.success' : 'loggedIn.success',
        titleKey: 'successTitle',
      });

      router.push(routes.app.users.list());
    } catch (error) {
      setIsAuthenticated(false);
      setServerError('WrongEmailOrPassword');

      showToast({
        type: 'user',
        action: 'failedLogin',
        titleKey: 'errorTitle',
        toastType: 'error',
      });
    }
  };

  const logOut = async () => {
    try {
      await axios.delete(`${baseURL}${routes.api.session.delete()}`, {
        withCredentials: true,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      removeUserFromStorage();
    }
  };

  useEffect(() => {
    const savedUser = getUserFromStorage();

    if (savedUser) {
      setUser(savedUser);
      setIsAuthenticated(true);
      setIsLoading(false);
    } else {
      fetchCurrentUser().finally(() => setIsLoading(false));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logOut,
        serverError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
