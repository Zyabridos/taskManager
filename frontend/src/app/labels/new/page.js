'use client';

import { useTranslation } from 'react-i18next';
import CreateLabelForm from '../../../forms/createForms/CreateLabelForm';
import PageSection from '../../../components/Lists/PageListSection';
import ProtectedPage from '../../../components/Protected/ProtectedPage';

const LabelsListPage = () => {
  const { t } = useTranslation('tables');

  return (
    <ProtectedPage fallback={<p>{t('common.loading')}</p>}>
      <PageSection title={t('labels.pageTitle')}>
        <CreateLabelForm />
      </PageSection>
    </ProtectedPage>
  );
};

export default LabelsListPage;
