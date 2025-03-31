'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/authContex';
import routes from '../../routes';

const baseURL = 'http://localhost:3000';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`${baseURL}${routes.app.session.new()}`);
    }
  }, [isAuthenticated, router]);

  return children;
};

export default ProtectedRoute;
