'use client';

import CreateTaskForm from '../../../forms/createForms/CreateTaskForm';
import { useTranslation } from 'react-i18next';

const newTaskPage = () => {
  const { t } = useTranslation('tasks');
  return (
    <div>
      <h1 className="px-20 pt-10 text-5xl font-semibold text-slate-800">{t('form.createTitle')}</h1>
      <CreateTaskForm />
    </div>
  );
};

export default newTaskPage;
