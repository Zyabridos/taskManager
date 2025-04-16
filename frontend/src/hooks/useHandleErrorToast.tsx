'use client';

import { AxiosError } from 'axios';

/**
 * `useHandleToastError` - custom hook returns func that proceed error and shows correspondend toast
*/

type ToastParams = {
  type: string;
  action: string;
  titleKey?: string;
  toastType: 'error' | 'success';
  message?: string;
};

type ShowToast = (params: ToastParams) => void;

type HandleToastParams = {
  type: string;
  action?: string;
  titleKey?: string;
};

const useHandleToastError =
  (showToast: ShowToast) =>
  (
    error: AxiosError<{ message?: string }>,
    { type, action, titleKey }: HandleToastParams
  ): void => {
    const response = error?.response;
    const message = response?.data?.message;

    if (response?.status === 403) {
      showToast({
        type,
        action: 'notOwner',
        titleKey: titleKey || 'errorTitle',
        toastType: 'error',
        message,
      });
    } else if (response?.status === 422) {
      showToast({
        type,
        action: 'hasTasks',
        titleKey: titleKey || 'errorTitle',
        toastType: 'error',
      });
    } else {
      showToast({
        type,
        action: action || 'failedDelete',
        titleKey: titleKey || 'errorTitle',
        toastType: 'error',
      });
    }
  };

export default useHandleToastError;
