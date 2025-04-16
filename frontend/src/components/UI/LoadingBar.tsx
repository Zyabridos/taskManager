'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

const LoadingBar: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <div className="flex h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-500 border-t-transparent" />
        <p className="text-sm text-gray-600">{t('loading')}</p>
      </div>
    </div>
  );
};

export default LoadingBar;
