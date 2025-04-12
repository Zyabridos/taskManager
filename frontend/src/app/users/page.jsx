'use client';

import { useTranslation } from 'react-i18next';
import UserList from '../../components/Lists/UserList';
import PageSection from '../../components/Lists/PageListSection';
import ProtectedPage from '../../components/Protected/ProtectedPage';

const UserListPage = () => {
  const { t } = useTranslation('tables');

  return (
    <ProtectedPage fallback={<p>{t('common.loading')}</p>}>
      <PageSection title={t('users.pageTitle')}>
        <UserList />
      </PageSection>
    </ProtectedPage>
  );
};

export default UserListPage;
