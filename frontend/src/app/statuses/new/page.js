'use client';

import CreateStatusForm from '../../../forms/CreateStatusForm';
import { useTranslation } from 'react-i18next';

const newStatusPage = () => {
  const { t } = useTranslation('statuses');
  return (
    <div>
      <h1 className="px-20 pt-10 text-5xl font-semibold text-slate-800">{t('form.createTitle')}</h1>
      <CreateStatusForm />
    </div>
  );
};

export default newStatusPage;
