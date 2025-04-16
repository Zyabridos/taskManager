'use client';

import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import CustomToast from '../components/UI/CustomToast';

/**
 * Custom hook to show a translated toast message with a visual style.
 *
 * @returns {Object} An object with the showToast function.
 */

type ToastParams = {
  type: string; // Entity type, e.g. 'user', 'label', 'task'
  action: string; // Action key, e.g. 'created', 'updated', 'alreadyExists'
  titleKey?: string; // Key for toast title, e.g. 'successTitle', 'errorTitle'
  toastType?: 'success' | 'error'; // Optional visual type (color/icon)
};

const useEntityToast = () => {
  const { t: tToast } = useTranslation('toast');

  const showToast = ({
    type,
    action,
    titleKey = 'successTitle',
    toastType = 'success',
  }: ToastParams): void => {
    toast.custom(tId => (
      <CustomToast
        title={tToast(titleKey)}
        message={tToast(`${action}.${type}`)}
        onClick={() => toast.dismiss(tId)}
        toastType={toastType}
      />
    ));
  };

  return { showToast };
};

export default useEntityToast;
