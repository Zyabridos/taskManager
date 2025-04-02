'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DeleteButton, HrefButton } from '../Buttons';
import { format } from 'date-fns';
import ruLocale from 'date-fns/locale/ru';
import { useTranslation } from 'react-i18next';
import routes from '../../routes';
import { deleteTaskThunk, fetchTasks } from '../../store/slices/tasksSlice';
import useEntityToast from '../../hooks/useEntityToast';
import TaskFilter from '../TaskFilter';
import { tasksApi } from '@/api/tasksApi';
import { useRouter, usePathname } from 'next/navigation';

const TasksList = () => {
  const dispatch = useDispatch();
  const { list, status, error } = useSelector(state => state.tasks);
  const { t } = useTranslation('tables');
  const { t: tButtons } = useTranslation('buttons');
  const { t: tTasks } = useTranslation('tasks');
  const { showToast } = useEntityToast();

  const [meta, setMeta] = useState({
    statuses: [],
    executors: [],
    labels: [],
  });

  const router = useRouter();
  const pathname = usePathname();

  const parseQuery = () => {
    const urlSearch = new URLSearchParams(window.location.search);
    return {
      ...(urlSearch.get('status') && { status: Number(urlSearch.get('status')) }),
      ...(urlSearch.get('executor') && { executor: Number(urlSearch.get('executor')) }),
      ...(urlSearch.get('label') && { label: Number(urlSearch.get('label')) }),
      ...(urlSearch.get('isCreatorUser') && {
        isCreatorUser: urlSearch.get('isCreatorUser') === 'true',
      }),
    };
  };

  const [query, setQuery] = useState(parseQuery());

  useEffect(() => {
    dispatch(fetchTasks(query));
  }, [dispatch, query]);

  useEffect(() => {
    const loadMeta = async () => {
      try {
        const data = await tasksApi.getMeta();
        setMeta(data);
      } catch (e) {
        console.error('Ошибка загрузки meta:', e);
        showToast({
          type: 'task',
          action: 'failedLoadMeta',
          titleKey: 'errorTitle',
          type: 'error',
        });
      }
    };
    loadMeta();
  }, []);

  const handleFilter = values => {
    const params = new URLSearchParams();

    if (values.status) params.set('status', values.status);
    if (values.executor) params.set('executor', values.executor);
    if (values.label) params.set('label', values.label);
    if (values.isCreatorUser) params.set('isCreatorUser', 'true');

    const queryString = params.toString();
    router.replace(`${pathname}?${queryString}`);
    setQuery(parseQuery()); // обновим query вручную после изменения URL
  };

  const handleDelete = async id => {
    try {
      await dispatch(deleteTaskThunk(id)).unwrap();
      showToast({ type: 'task', action: 'deleted', titleKey: 'successTitle' });
    } catch (e) {
      showToast({
        type: 'task',
        action: 'failedDelete',
        titleKey: 'errorTitle',
        type: 'error',
      });
      console.error(e);
    }
  };

  if (status === 'loading') return <p>{t('common.loading')}</p>;
  if (status === 'failed')
    return (
      <p>
        {t('common.error')}: {error}
      </p>
    );

  return (
    <div className="mt-6 overflow-x-auto">
      <div className="pb-2">
        <HrefButton href={routes.app.tasks.create()} buttonText={tTasks('form.createTitle')} />
      </div>

      <TaskFilter
        statuses={meta.statuses}
        executors={meta.executors}
        labels={meta.labels}
        initialValues={query}
        onFilter={handleFilter}
      />

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
              {t('common.columns.id')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
              {t('tasks.columns.name')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
              {t('tasks.columns.status')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
              {t('tasks.columns.executor')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
              {t('common.columns.createdAt')}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">
              {t('common.columns.actions')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {list.map(task => (
            <tr key={task.id}>
              <td className="px-6 py-4 text-sm text-gray-900">{task.id}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{task.name}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{task.status.name}</td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {task.executor.firstName} {task.executor.lastName}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {format(new Date(task.createdAt), 'dd.MM.yyyy HH:mm', { locale: ruLocale })}
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                  <HrefButton href={routes.app.tasks.edit(task.id)} buttonText={tButtons('edit')} />
                  <DeleteButton onClick={() => handleDelete(task.id)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TasksList;
