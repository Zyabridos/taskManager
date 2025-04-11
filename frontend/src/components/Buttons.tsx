'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

interface HrefButtonProps {
  href: string;
  buttonText: string;
  className?: string;
}

export const HrefButton: React.FC<HrefButtonProps> = ({ href, buttonText, className = '' }) => {
  return (
    <Link
      href={href}
      className={`inline-block rounded border border-e-stone-800 bg-transparent px-4 py-2 font-semibold text-gray-900 transition hover:border-transparent hover:bg-gray-800 hover:text-amber-50 ${className}`}
    >
      {buttonText}
    </Link>
  );
};

interface DeleteButtonProps {
  onClick: () => void;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({ onClick }) => {
  const { t: tButtons } = useTranslation('buttons');

  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded border border-red-600 bg-transparent px-4 py-2 font-semibold text-red-600 transition hover:border-transparent hover:bg-red-600 hover:text-white"
    >
      {tButtons('delete')}
    </button>
  );
};

interface TransparentGraySubmitBtnProps {
  buttonText: string;
  className?: string;
}

export const TransparentGraySubmitBtn: React.FC<TransparentGraySubmitBtnProps> = ({ buttonText, className = '' }) => {
  return (
    <button
      type="submit"
      className={`rounded border border-e-stone-800 bg-transparent px-4 py-2 font-semibold text-gray-900 hover:border-transparent hover:bg-gray-800 hover:text-amber-50 ${className}`}
    >
      {buttonText}
    </button>
  );
};
