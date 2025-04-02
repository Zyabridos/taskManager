'use client';

import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import CustomToast from '@/components/UI/CustomToast';

/**
 * Displays a custom toast with translations and visual style.
 *
 * @param {Object} params - Toast config.
 * @param {string} params.type - Entity type: 'user' | 'label' | 'task' | etc.
 * @param {string} params.action - Action key: 'created' | 'updated' | 'alreadyExists' | etc.
 * @param {string} params.titleKey - Translation key for title: 'successTitle' | 'errorTitle'
 * @param {'success' | 'error'} [params.toastType='success'] - Visual toast type (color/icon)
 */
const useEntityToast = () => {
  const { t: tToast } = useTranslation('toast');

  const showToast = ({ type, action, titleKey, toastType = 'success' }) => {
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
