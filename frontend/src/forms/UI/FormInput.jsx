'use client';

import React from 'react';

const FormInput = ({ id, type = 'text', field, touched, error }) => {
  const hasError = touched && error;

  return (
    <input
      id={id}
      type={type}
      placeholder=" "
      {...field}
      className={`peer h-14 w-full appearance-none rounded border px-3 pt-5 pb-2 text-sm text-gray-700 shadow focus:ring-2 focus:outline-none ${
        hasError ? 'border-red-500' : 'border-gray-300'
      }`}
    />
  );
};

export default FormInput;
