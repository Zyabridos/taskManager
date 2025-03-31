'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import CustomToast from '../components/UI/CustomToast';

const useToast = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation('toast');

  useEffect(() => {
    const entries = Array.from(searchParams.entries());

    for (const [key, value] of entries) {
      const translationKey = `${key}.${value}`; // created.status, deleted.user и т.д.
      const translated = t(translationKey, { defaultValue: '' });

      if (translated !== '') {
        toast.custom(tId => (
          <CustomToast
            title={t('success')} // envt t(`${key}.title`) for diff titles
            message={translated}
            onClick={() => toast.dismiss(tId)}
          />
        ));

        // remove params from URL
        const newParams = new URLSearchParams(searchParams);
        newParams.delete(key);
        router.replace(`${pathname}?${newParams.toString()}`);
        break;
      }
    }
  }, [searchParams, router, pathname, t]);
};

export default useToast;
