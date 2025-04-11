'use client';

import React from 'react';

type Option = {
  id: number;
  name: string;
};

interface MultiSelectFieldProps {
  id: string;
  label: string;
  options: Option[];
  value: number[];
  onChange: (selected: number[]) => void;
  error?: string;
  touched?: boolean;
}

const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  id,
  label,
  options,
  value = [],
  onChange,
  error,
  touched,
}) => {
  const hasError = touched && !!error;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValues = Array.from(e.target.selectedOptions).map((opt) =>
      Number(opt.value)
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
        value={value.map(String)}
        onChange={handleChange}
        className={`w-full rounded border p-2 shadow-sm focus:outline-none focus:ring ${
          hasError ? 'border-red-500' : 'border-gray-300'
        }`}
      >
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

export default MultiSelectField;
