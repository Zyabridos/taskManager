'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/authContex';
import routes from '../routes';

/**
 * A custom hook to protect routes that require authentication.
 * Redirects to the login page if the user is not authenticated.
 *
 * @returns {boolean} isSafeRender - Indicates whether it's safe to render protected content.
 */

const useProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [isSafeRender, setisSafeRender] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace(routes.app.session.new());
      } else {
        setisSafeRender(true);
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return isSafeRender;
};

export default useProtectedRoute;
