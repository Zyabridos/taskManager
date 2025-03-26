'use client';

import RegisterForm from '../../../forms/RegisterForm';
import { useTranslation } from 'react-i18next';

export default function NewUserPage() {
  const { t } = useTranslation('users');
  return (
    <div>
      <h1 className="px-20 pt-10 text-5xl font-semibold text-slate-800">{t('form.createTitle')}</h1>
      <RegisterForm />
    </div>
  );
}
