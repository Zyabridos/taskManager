'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/authContex';
import routes from '../routes';

/**
 * A custom hook to protect routes that require authentication.
 * Redirects to the login page if the user is not authenticated.
 *
 * @returns {boolean} isSafeRender if it's safe to render protected content.
 */

const useProtectedRoute = (): boolean => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [isSafeRender, setIsSafeRender] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace(routes.app.session.new());
      } else {
        setIsSafeRender(true);
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return isSafeRender;
};

export default useProtectedRoute;
