'use client';

import React from 'react';
import { TransparentGrayBtn } from './Buttons';

const EditFormWrapper = ({ title, onSubmit, children, buttonText }) => (
  <div className="mx-auto mt-10 max-w-400">
    <h1 className="flex justify-start pl-10 text-5xl font-bold text-gray-900">{title}</h1>
    <div className="bg-white px-8 pt-6 pb-8">
      <form onSubmit={onSubmit} className="m-2">
        {children}
        <div className="mt-6 flex justify-start">
          <TransparentGrayBtn buttonText={buttonText} />
        </div>
      </form>
    </div>
  </div>
);

export default EditFormWrapper;
