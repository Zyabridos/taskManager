'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/authContex';
import { toast } from 'sonner';
import routes from '../../routes';

const baseURL = 'http://localhost:3000';

const withAuth = WrappedComponent => {
  const ProtectedComponent = props => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated) {
        router.push(`${baseURL}${routes.app.session.new()}`);
      }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return ProtectedComponent;
};

export default withAuth;
