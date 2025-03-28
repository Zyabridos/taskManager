import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  saveUserToStorage,
  getUserFromStorage,
  removeUserFromStorage,
} from '../utils/storage/authStorage';
import routes from '../routes'

export const AuthContext = createContext();

const baseURL = 'http://localhost:5001';

const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [serverError, setServerError] = useState(null);

  const fetchCurrentUser = async () => {
    console.log('fetching user by adres:', `${baseURL}${routes.api.session.current()}`);
    try {
      const response = await axios.get(`${baseURL}${routes.api.session.current()}`, {
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
    console.log('POST login to:', `${baseURL}${routes.api.session.current()}`);
    try {
      const response = await axios.post(
        `${baseURL}${routes.api.session.current()}`,
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
      setServerError('WrongEmailOrPassword');
    }
  };

  const logOut = async () => {
    console.log('DELETE login to:', `${baseURL}${routes.api.session.delete()}`);
    try {
      await axios.delete(`${baseURL}${routes.api.session.delete()}`, { withCredentials: true });
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
      value={{ user, isAuthenticated, login, logOut, serverError }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
