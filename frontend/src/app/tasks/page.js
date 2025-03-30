'use client';

import { useTranslation } from 'react-i18next';
import TasksList from '../../components/Lists/TasksList';
import PageSection from '../../components/PageSection';

const TasksListPage = () => {
  const { t } = useTranslation('tables');

  return (
    <PageSection title={t('tasks.pageTitle')}>
      <TasksList />
    </PageSection>
  );
};

export default TasksListPage;
