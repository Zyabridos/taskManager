'use client';

import { useTranslation } from 'react-i18next';
import EditUserForm from '../../../../forms/editForms/EditUserForm';
import PageSection from '../../../../components/Lists/PageListSection';
import ProtectedPage from '../../../../components/Protected/ProtectedPage';

const EditUserPage = () => {
  const { t } = useTranslation('tables');

  return (
    <ProtectedPage fallback={<p>{t('common.loading')}</p>}>
      <PageSection title={t('users.pageTitle')}>
        <EditUserForm />
      </PageSection>
    </ProtectedPage>
  );
};

export default EditUserPage;
