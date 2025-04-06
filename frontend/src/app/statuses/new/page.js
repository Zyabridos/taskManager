'use client';

import { useTranslation } from 'react-i18next';
import CreateStatusForm from '../../../forms/createForms/CreateStatusForm';
import PageSection from '../../../components/Lists/PageListSection';
import ProtectedPage from '../../../components/Protected/ProtectedPage';

const StatussListPage = () => {
  const { t } = useTranslation('tables');

  return (
    <ProtectedPage fallback={<p>{t('common.loading')}</p>}>
      <PageSection title={t('statuses.pageTitle')}>
        <CreateStatusForm />
      </PageSection>
    </ProtectedPage>
  );
};

export default StatussListPage;
