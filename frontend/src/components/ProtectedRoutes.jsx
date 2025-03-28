'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/authContex';
import routes from '../routes';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(routes.session.new);
    }
  }, [isAuthenticated, router]);

  return children;
};

export default ProtectedRoute;
