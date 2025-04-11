'use client';

import React from 'react';
import useProtectedRoute from '../../hooks/useProtectedRoute';

/**
 * A reusable wrapper component that protects any part of the app by requiring authentication.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to render when the user is authenticated.
 * @param {React.ReactNode} [props.fallback=null] - Fallback content to render while authentication is being verified.
 *
 * @returns {JSX.Element | null} - Protected content or fallback during loading.
 */
interface ProtectedProps {
  children: React.ReactNode;
  fallback?: React.ReactNode | null;
}

const Protected: React.FC<ProtectedProps> = ({ children, fallback = null }) => {
  const isReady = useProtectedRoute();

  if (!isReady) return <>{fallback}</>;

  return <>{children}</>;
};

export default Protected;
