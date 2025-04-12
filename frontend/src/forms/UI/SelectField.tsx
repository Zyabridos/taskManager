'use client';

import React from 'react';
import { FieldInputProps } from 'formik';

interface Option {
  id: number;
  name: string;
}

interface SelectFieldProps {
  id: string;
  label: string;
  options: Option[];
  // eslint-disable-next-line
  field: FieldInputProps<any>;
  error?: string;
  touched?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({ id, label, options, field, error, touched }) => {
  const hasError = touched && !!error;

  return (
    <div className="mb-3">
      <label htmlFor={id} className="mb-1 block text-sm text-gray-700">
        {label}
      </label>
      <select
        id={id}
        {...field}
        className={`w-full rounded border p-2 shadow-sm focus:ring focus:outline-none ${
          hasError ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        <option value="">{label}</option>
        {options.map(({ id: optionId, name }) => (
          <option key={optionId} value={optionId}>
            {name}
          </option>
        ))}
      </select>
      {hasError && <p className="mt-1 text-xs text-red-500 italic">{error}</p>}
    </div>
  );
};

export default SelectField;
