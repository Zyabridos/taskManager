'use client';

import React from 'react';

const MultiSelectField = ({ id, label, options, value = [], onChange, error, touched }) => {
  const hasError = touched && error;

  const handleChange = e => {
    if (!onChange) return;
    const selectedValues = Array.from(e.target?.selectedOptions || []).map(opt =>
      Number(opt.value),
    );
    onChange(selectedValues);
  };

  return (
    <div className="mb-6">
      <label htmlFor={id} className="mb-1 block text-sm text-gray-700">
        {label}
      </label>
      <select
        id={id}
        multiple
        value={value || []}
        onChange={handleChange}
        className={`w-full rounded border p-2 shadow-sm focus:ring focus:outline-none ${
          hasError ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        {options.map(({ id, name }) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>
      {hasError && <p className="mt-1 text-xs text-red-500 italic">{error}</p>}
    </div>
  );
};

export default MultiSelectField;
