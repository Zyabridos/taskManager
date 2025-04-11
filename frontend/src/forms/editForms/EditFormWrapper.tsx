'use client';

import React, { ReactNode, FormEventHandler } from 'react';
import { TransparentGraySubmitBtn } from '../../components/Buttons';

interface EditFormWrapperProps {
  title: string;
  onSubmit: FormEventHandler<HTMLFormElement>;
  children: ReactNode;
  buttonText: string;
}

const EditFormWrapper: React.FC<EditFormWrapperProps> = ({
  title,
  onSubmit,
  children,
  buttonText,
}) => (
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

export default EditFormWrapper;
