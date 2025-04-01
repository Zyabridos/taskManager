'use client';

import { useTranslation } from 'react-i18next';
import TasksList from '../../components/Lists/TasksList';
import PageSection from '../../components/Lists/PageListSection';
import ProtectedPage from '../../components/Protected/ProtectedPage';

const TasksListPage = () => {
  const { t } = useTranslation('tables');

  return (
    <ProtectedPage fallback={<p>{t('common.loading')}</p>}>
      <PageSection title={t('tasks.pageTitle')}>
        <TasksList />
      </PageSection>
    </ProtectedPage>
  );
};

export default TasksListPage;
