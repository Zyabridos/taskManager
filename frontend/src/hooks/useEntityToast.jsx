'use client';

import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import CustomToast from '@/components/UI/CustomToast';

/**
 * Displays a custom toast message for a given entity type and action.
 *
 * @param type - The entity type (e.g. 'status', 'user', 'label')
 * @param action - The action performed (e.g. 'created', 'updated', 'deleted', 'failedCreate', 'failedDelete)
 * @param titleKey - The translation key for the toast title (e.g. 'successTitle', 'errorTitle')
 */

const useEntityToast = () => {
  const { t: tToast } = useTranslation('toast');

  const showToast = ({ type, action, titleKey }) => {
    toast.custom(tId => (
      <CustomToast
        title={tToast(titleKey)}
        message={tToast(`${action}.${type}`)}
        onClick={() => toast.dismiss(tId)}
      />
    ));
  };

  return { showToast };
};

export default useEntityToast;
