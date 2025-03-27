'use client';

import SignInForm from '../../../forms/SignInForm';
import { useTranslation } from 'react-i18next';

export default function NewUserPage() {
  const { t: tAuth } = useTranslation('auth');
  return (
    <div>
      <h1 className="px-20 pt-10 text-5xl font-semibold text-slate-800">{tAuth('titles.login')}</h1>
      <SignInForm />
    </div>
  );
}
