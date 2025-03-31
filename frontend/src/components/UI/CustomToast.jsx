'use client';

import { CheckCircle } from 'lucide-react';
import { NAVBARHEIGHT } from '../../components/Navbar/Navbar';

const CustomToast = ({ title = 'Success!', message = 'Your action has been successfully completed', onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{ marginTop: NAVBARHEIGHT }}
      className="fixed right-0 z-50 flex w-[420px] cursor-pointer items-start gap-4 rounded-xl border border-green-300 bg-green-100 p-5 shadow-lg"
    >
      <CheckCircle className="mt-1 h-6 w-6 text-green-600" />
      <div className="text-sm leading-tight">
        <p className="font-semibold text-green-700">{title}</p>
        <p className="text-green-800">{message}</p>
      </div>
    </div>
  );
};

export default CustomToast;
