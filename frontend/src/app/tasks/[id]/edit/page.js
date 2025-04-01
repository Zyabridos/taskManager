'use client';

import { useTranslation } from 'react-i18next';
import EditTaskForm from '../../../../forms/editForms/EditTasksForm';
import PageSection from '../../../../components/Lists/PageListSection';
import ProtectedPage from '../../../../components/Protected/ProtectedPage';

const EditTaskPage = () => {
  const { t } = useTranslation('tables');

  return (
    <ProtectedPage fallback={<p>{t('common.loading')}</p>}>
      <PageSection title={t('tasks.pageTitle')}>
        <EditTaskForm />
      </PageSection>
    </ProtectedPage>
  );
};

export default EditTaskPage;
