'use client';

import React from 'react';
import { TransparentGraySubmitBtn } from '../../components/Buttons';
import withAuth from '../../components/Protected/withAuth';

const EditFormWrapper = ({ title, onSubmit, children, buttonText }) => (
  <div className="max-w-400 mx-auto mt-10">
    <h1 className="flex justify-start pl-10 text-5xl font-bold text-gray-900">{title}</h1>
    <div className="bg-white px-8 pb-8 pt-6">
      <form onSubmit={onSubmit} className="m-2">
        {children}
        <div className="mt-6 flex justify-start">
          <TransparentGraySubmitBtn buttonText={buttonText} />
        </div>
      </form>
    </div>
  </div>
);

export default withAuth(EditFormWrapper);
