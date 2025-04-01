'use client';

import { CheckCircle, XCircle } from 'lucide-react';
import { NAVBARHEIGHT } from '../../components/Navbar/Navbar';

/**
 * CustomToast component for displaying success or error messages.
 *
 * @param {Object} props - The component props.
 * @param {string} props.title - The title of the toast. Default is "Success!".
 * @param {string} props.message - The message body of the toast. Default is a generic success message.
 * @param {() => void} props.onClick - A callback to be triggered when the toast is clicked (usually to dismiss it).
 * @param {'success' | 'error'} props.type - The type of toast, determines the color scheme and icon. Default is 'success'.
 */
const CustomToast = ({
  title = 'Success!',
  message = 'Your action has been successfully completed',
  onClick,
  type = 'success',
}) => {
  const isError = type === 'error';

  const containerClass = isError ? 'border-red-300 bg-red-100' : 'border-green-300 bg-green-100';

  const iconClass = isError ? 'text-red-600' : 'text-green-600';

  const titleClass = isError ? 'text-red-700' : 'text-green-700';
  const messageClass = isError ? 'text-red-800' : 'text-green-800';

  const Icon = isError ? XCircle : CheckCircle;

  return (
    <div
      onClick={onClick}
      style={{ marginTop: NAVBARHEIGHT }}
      className={`fixed right-0 z-50 flex w-[420px] cursor-pointer items-start gap-4 rounded-xl border p-5 shadow-lg ${containerClass}`}
    >
      <Icon className={`mt-1 h-6 w-6 ${iconClass}`} />
      <div className="text-sm leading-tight">
        <p className={`font-semibold ${titleClass}`}>{title}</p>
        <p className={messageClass}>{message}</p>
      </div>
    </div>
  );
};

export default CustomToast;
