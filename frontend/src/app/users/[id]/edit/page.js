'use client';

import { useTranslation } from 'react-i18next';
import EditUserForm from '../../../../forms/editForms/EditUsersForm';
import PageSection from '../../../../components/Lists/PageListSection';
import ProtectedPage from '../../../../components/Protected/ProtectedPage';

const EditUserPage = () => {
  const { t } = useTranslation('tables');

  return (
    <ProtectedPage fallback={<p>{t('common.loading')}</p>}>
      <PageSection title={t('Users.pageTitle')}>
        <EditUserForm />
      </PageSection>
    </ProtectedPage>
  );
};

export default EditUserPage;
