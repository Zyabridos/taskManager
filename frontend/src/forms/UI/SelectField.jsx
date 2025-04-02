'use client';

import React from 'react';

const SelectField = ({ id, label, options, field, error, touched }) => {
  const hasError = touched && error;

  return (
    <div className="mb-6">
      <label htmlFor={id} className="mb-1 block text-sm text-gray-700">
        {label}
      </label>
      <select
        id={id}
        {...field}
        className={`w-full rounded border p-2 shadow-sm focus:outline-none focus:ring ${
          hasError ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        <option value="">{label}</option>
        {options.map(({ id, name }) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>
      {hasError && <p className="mt-1 text-xs italic text-red-500">{error}</p>}
    </div>
  );
};

export default SelectField;
