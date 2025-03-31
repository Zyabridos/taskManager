'use client';

import { useTranslation } from 'react-i18next';
import UserList from '../../components/Lists/UserList';
import PageSection from '../../components/Lists/ProtectedPageListSection';
import useToast from '../../hooks/useToast';

const UserListPage = () => {
  useToast();
  const { t } = useTranslation('tables');

  return (
    <PageSection title={t('users.pageTitle')}>
      <UserList />
    </PageSection>
  );
};

export default UserListPage;
