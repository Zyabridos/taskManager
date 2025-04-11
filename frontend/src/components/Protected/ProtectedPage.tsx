'use client';

import React from 'react';
import Protected from './Protected';

/**
 * A wrapper component for protecting entire pages that require user authentication.
 *
 * @component
 * @param {React.ReactNode} children - The content to render if the user is authenticated.
 * @param {React.ReactNode} [fallback=null] - The fallback UI to display while authentication is being checked.
 *
 * @returns {JSX.Element} Protected content if authenticated, fallback otherwise.
 */

interface ProtectedPageProps {
  children: React.ReactNode;
  fallback?: React.ReactNode | null;
}

const ProtectedPage: React.FC<ProtectedPageProps> = ({ children, fallback = null }) => {
  return <Protected fallback={fallback}>{children}</Protected>;
};

export default ProtectedPage;
