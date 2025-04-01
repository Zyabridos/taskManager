'use client';

import { useTranslation } from 'react-i18next';
import StatusesList from '../../components/Lists/StatusesList';
import PageSection from '../../components/Lists/PageListSection';
import ProtectedPage from '../../components/Protected/ProtectedPage';

const StatusesListPage = () => {
  const { t } = useTranslation('tables');

  return (
    <ProtectedPage fallback={<p>{t('common.loading')}</p>}>
      <PageSection title={t('statuses.pageTitle')}>
        <StatusesList />
      </PageSection>
    </ProtectedPage>
  );
};

export default StatusesListPage;
