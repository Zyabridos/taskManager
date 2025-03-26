'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

export const EditButton = () => {
  const { t: tButtons } = useTranslation('buttons');
  return (
    <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
      {tButtons('edit')}
    </button>
  );
};

export const DeleteButton = () => {
  const { t: tButtons } = useTranslation('buttons');
  return (
    <button className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700">
      {tButtons('delete')}
    </button>
  );
};

export const TransparentGrayBtn = ({ buttonText }) => {
  return (
    <button
      type="submit"
      className="rounded border border-e-stone-800 bg-transparent px-4 py-2 font-semibold text-gray-900 hover:border-transparent hover:bg-gray-800 hover:text-amber-50"
    >
      {buttonText}
    </button>
  );
};
