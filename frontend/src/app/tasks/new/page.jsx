'use client';

import { useTranslation } from 'react-i18next';
import CreateTaskForm from '../../../forms/createForms/CreateTaskForm';
import PageSection from '../../../components/Lists/PageListSection';
import ProtectedPage from '../../../components/Protected/ProtectedPage';

const TasksListPage = () => {
  const { t } = useTranslation('tables');

  return (
    <ProtectedPage fallback={<p>{t('common.loading')}</p>}>
      <PageSection title={t('tasks.pageTitle')}>
        <CreateTaskForm />
      </PageSection>
    </ProtectedPage>
  );
};

export default TasksListPage;
