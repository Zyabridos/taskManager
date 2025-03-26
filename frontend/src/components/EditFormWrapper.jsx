'use client';

import React from 'react';

const EditFormWrapper = ({ title, onSubmit, children, buttonText }) => (
  <div className="mx-auto mt-10 max-w-400">
    <h1 className="text-5xl pl-10 flex justify-start font-bold text-gray-800">{title}</h1>
    <div className=" bg-white px-8 pt-6 pb-8">
      <form onSubmit={onSubmit} className='m-2'>
        {children}
        <div className="mt-6 flex justify-start">
          <button
            type="submit"
            className="bg-transparent hover:bg-stone-600 text-e-stone-800 font-semibold hover:text-white py-2 px-4 border border-e-stone-800 hover:border-transparent rounded">
            {buttonText}
          </button>
        </div>
      </form>
    </div>
  </div>
);

export default EditFormWrapper;
