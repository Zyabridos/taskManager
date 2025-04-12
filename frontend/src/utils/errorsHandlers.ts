import axios from 'axios';

export const getErrorMessage = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.error || 'Unknown error';
  }
  if (err instanceof Error) {
    return err.message;
  }
  return 'Unknown error';
};

export const getErrorPayload = (err: unknown): { error: string } => {
  if (axios.isAxiosError(err)) {
    return { error: err.response?.data?.error || 'Unknown error' };
  }
  if (err instanceof Error) {
    return { error: err.message };
  }
  return { error: 'Unknown error' };
};

interface ToastOptions {
  type: string;
  toast: (params: { type: string; action: string; titleKey: string; toastType: 'error' }) => void;
  fallbackAction?: string;
}

export const handleFormError = (
  error: unknown,
  { type, toast, fallbackAction = 'failedCreate' }: ToastOptions,
) => {
  if (axios.isAxiosError(error) && error.response?.status === 422) {
    toast({
      type,
      action: 'alreadyExists',
      titleKey: 'errorTitle',
      toastType: 'error',
    });
    return;
  }

  toast({
    type,
    action: fallbackAction,
    titleKey: 'errorTitle',
    toastType: 'error',
  });

  console.error(error);
};
