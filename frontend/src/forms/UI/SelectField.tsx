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
  field: FieldInputProps<any>; // можно уточнить тип, если ты знаешь, что это string или number
  error?: string;
  touched?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  id,
  label,
  options,
  field,
  error,
  touched,
}) => {
  const hasError = touched && !!error;

  return (
    <div className="mb-3">
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
        {options.map(({ id: optionId, name }) => (
          <option key={optionId} value={optionId}>
            {name}
          </option>
        ))}
      </select>
      {hasError && <p className="mt-1 text-xs italic text-red-500">{error}</p>}
    </div>
  );
};

export default SelectField;
