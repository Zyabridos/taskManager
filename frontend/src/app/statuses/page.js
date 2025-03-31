'use client';

import { useTranslation } from 'react-i18next';
import StatusesList from '../../components/Lists/StatusesList';
import PageSection from '../../components/Lists/ProtectedPageListSection';

const StatusesListPage = () => {
  const { t } = useTranslation('tables');

  return (
    <PageSection title={t('statuses.pageTitle')}>
      <StatusesList />
    </PageSection>
  );
};

export default StatusesListPage;
