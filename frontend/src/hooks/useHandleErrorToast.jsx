'use client';

const useHandleToastError =
  showToast =>
  (error, { type, action, titleKey }) => {
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
