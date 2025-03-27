'use client';

const NoSSR = ({ children }) => {
  if (typeof window === 'undefined') return null;
  return <>{children}</>;
};

export default NoSSR;
