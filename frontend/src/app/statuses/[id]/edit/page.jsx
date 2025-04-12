'use client';

import { useTranslation } from 'react-i18next';
import EditStatusForm from '../../../../forms/editForms/EditStatusesForm';
import PageSection from '../../../../components/Lists/PageListSection';
import ProtectedPage from '../../../../components/Protected/ProtectedPage';

const EditStatusPage = () => {
  const { t } = useTranslation('tables');

  return (
    <ProtectedPage fallback={<p>{t('common.loading')}</p>}>
      <PageSection title={t('statuses.pageTitle')}>
        <EditStatusForm />
      </PageSection>
    </ProtectedPage>
  );
};

export default EditStatusPage;
