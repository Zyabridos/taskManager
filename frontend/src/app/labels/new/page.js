'use client';

import CreateLabelForm from '../../../forms/createForms/CreateLabelForm';
import { useTranslation } from 'react-i18next';

const newLabelPage = () => {
  const { t } = useTranslation('labels');
  return (
    <div>
      <h1 className="px-20 pt-10 text-5xl font-semibold text-slate-800">{t('form.createTitle')}</h1>
      <CreateLabelForm />
    </div>
  );
};

export default newLabelPage;
