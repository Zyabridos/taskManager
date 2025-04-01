'use client';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DeleteButton, HrefButton } from '../Buttons';
import { format } from 'date-fns';
import ruLocale from 'date-fns/locale/ru';
import { useTranslation } from 'react-i18next';
import routes from '../../routes';
import { deleteTaskThunk, fetchTasks } from '../../store/slices/tasksSlice';
import useEntityToast from '../../hooks/useEntityToast';

const TasksList = () => {
  const dispatch = useDispatch();
  const { list, status, error } = useSelector(state => state.tasks);
  const { t } = useTranslation('tables');
  const { t: tButtons } = useTranslation('buttons');
  const { t: tTasks } = useTranslation('tasks');

  const { showToast } = useEntityToast();

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleDelete = async id => {
    try {
      await dispatch(deleteTaskThunk(id)).unwrap();
      showToast({ type: 'task', action: 'deleted', titleKey: 'successTitle' });
    } catch (e) {
      showToast({ type: 'task', action: 'failedDelete', titleKey: 'errorTitle', type: 'error' });
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
