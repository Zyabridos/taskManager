'use client';

import React from 'react';

interface FloatingLabelProps {
  htmlFor: string;
  text: string;
}

const FloatingLabel: React.FC<FloatingLabelProps> = ({ htmlFor, text }) => (
  <label
    htmlFor={htmlFor}
    className="absolute top-2 left-3 z-10 origin-[0] scale-100 transform text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:scale-75 peer-focus:text-blue-500"
  >
    {text}
  </label>
);

export default FloatingLabel;
