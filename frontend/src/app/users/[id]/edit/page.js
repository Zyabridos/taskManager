'use client';

import { useTranslation } from 'react-i18next';
import EditUserForm from '../../../../forms/EditUserForm';

export default function EditUserPage() {
  const { t } = useTranslation('auth');

  return (
    <div>
      <EditUserForm />
    </div>
  );
}
