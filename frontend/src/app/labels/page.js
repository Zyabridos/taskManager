'use client';

import { useTranslation } from 'react-i18next';
import LabelsList from '../../components/Lists/LabelsList';
import PageSection from '../../components/Lists/ProtectedPageListSection';

const LabelsListPage = () => {
  const { t } = useTranslation('tables');

  return (
    <PageSection title={t('labels.pageTitle')}>
      <LabelsList />
    </PageSection>
  );
};

export default LabelsListPage;
