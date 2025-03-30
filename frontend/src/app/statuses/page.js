'use client';

import { useTranslation } from 'react-i18next';
import StatusesList from '../../components/Lists/StatusesList';
import PageSection from '../../components/PageSection';

const StatusesListPage = () => {
  const { t } = useTranslation('tables');

  return (
    <PageSection title={t('users.pageTitle')}>
      <StatusesList />
    </PageSection>
  );
};

export default StatusesListPage;
