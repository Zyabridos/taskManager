import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  saveUserToStorage,
  getUserFromStorage,
  removeUserFromStorage,
} from '../utils/storage/authStorage';

export const AuthContext = createContext();

const baseURL = 'http://localhost:5001/api';

const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [serverError, setServerError] = useState(null);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(`${baseURL}/session`, {
        withCredentials: true,
      });

      setUser(response.data.user);
      setIsAuthenticated(true);
      saveUserToStorage(response.data.user);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
      removeUserFromStorage();
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${baseURL}/session`,
        { data: { email, password } },
        { withCredentials: true }
      );

      const loggedUser = response.data.user;
      setUser(loggedUser);
      setIsAuthenticated(true);
      setServerError(null);
      saveUserToStorage(loggedUser);
      router.push('/');
    } catch (error) {
      setIsAuthenticated(false);
      setServerError('Неверный логин или пароль');
    }
  };

  const logout = async () => {
    try {
      await axios.delete(`${baseURL}/session`, { withCredentials: true });
    } catch (e) {
      console.error(e);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      removeUserFromStorage();
      router.push('/login');
    }
  };

  useEffect(() => {
    const savedUser = getUserFromStorage();
    if (savedUser) {
      setUser(savedUser);
      setIsAuthenticated(true);
    } else {
      fetchCurrentUser();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, serverError }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
