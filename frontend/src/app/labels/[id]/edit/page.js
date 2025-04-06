'use client';

import { useTranslation } from 'react-i18next';
import EditLabelForm from '../../../../forms/editForms/EditLabelsForm';
import PageSection from '../../../../components/Lists/PageListSection';
import ProtectedPage from '../../../../components/Protected/ProtectedPage';

const EditLabelPage = () => {
  const { t } = useTranslation('tables');

  return (
    <ProtectedPage fallback={<p>{t('common.loading')}</p>}>
      <PageSection title={t('labels.pageTitle')}>
        <EditLabelForm />
      </PageSection>
    </ProtectedPage>
  );
};

export default EditLabelPage;
