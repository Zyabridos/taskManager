'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DeleteButton, HrefButton } from '../Buttons';
import { format } from 'date-fns';
import ruLocale from 'date-fns/locale/ru';
import { useTranslation } from 'react-i18next';
import routes from '../../routes';
import { deleteTaskThunk, fetchTasks } from '../../store/slices/tasksSlice';
import useEntityToast from '../../hooks/useEntityToast';
import useSortedTasks from '../../hooks/useSortableList';
import TaskFilter from '../TaskFilter';
import { tasksApi } from '../../api/tasksApi';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import SortableHeader from '../UI/SortableHeader';
import LoadingBar from '../UI/LoadingBar';

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

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const parseQuery = useCallback(() => {
    const urlSearch = new URLSearchParams(window.location.search);
    return {
      ...(urlSearch.get('status') && { status: Number(urlSearch.get('status')) }),
      ...(urlSearch.get('executor') && { executor: Number(urlSearch.get('executor')) }),
      ...(urlSearch.get('label') && { label: Number(urlSearch.get('label')) }),
      ...(urlSearch.get('isCreatorUser') && {
        isCreatorUser: urlSearch.get('isCreatorUser') === 'true',
      }),
    };
  }, []);

  const [query, setQuery] = useState(parseQuery);
  const { sortedList, sortField, sortOrder, handleSort } = useSortedTasks(list, 'id', 'asc');

  useEffect(() => {
    dispatch(fetchTasks(query));
  }, [dispatch, query]);

  useEffect(() => {
    const newQuery = parseQuery();
    setQuery(newQuery);
  }, [searchParams, parseQuery]);

  useEffect(() => {
    const loadMeta = async () => {
      try {
        const data = await tasksApi.getMeta();
        setMeta(data);
      } catch (e) {
        console.error('Error during meta uploading:', e);
        showToast({
          type: 'task',
          action: 'failedLoadMeta',
          titleKey: 'errorTitle',
          type: 'error',
        });
      }
    };
    loadMeta();
  }, [showToast]);

  const handleFilter = values => {
    const params = new URLSearchParams();

    if (values.status) params.set('status', values.status);
    if (values.executor) params.set('executor', values.executor);
    if (values.label) params.set('label', values.label);
    if (values.isCreatorUser) params.set('isCreatorUser', 'true');

    const queryString = params.toString();
    router.replace(`${pathname}?${queryString}`);
    setQuery({ ...values });
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

  if (status === 'loading') return <LoadingBar />;
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
            <SortableHeader
              label={t('common.columns.id')}
              field="id"
              currentSortField={sortField}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
            <SortableHeader
              label={t('tasks.columns.name')}
              field="name"
              currentSortField={sortField}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
            <SortableHeader
              label={t('tasks.columns.status')}
              field="status.name"
              currentSortField={sortField}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
            <SortableHeader
              label={t('tasks.columns.executor')}
              field="executor.firstName"
              currentSortField={sortField}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
            <SortableHeader
              label={t('common.columns.createdAt')}
              field="createdAt"
              currentSortField={sortField}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">
              {t('common.columns.actions')}
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 bg-white">
          {sortedList.map(task => (
            <tr
              key={task.id}
              data-id={task.id}
              data-name={task.name}
              data-executor={`${task.executor?.firstName ?? ''} ${task.executor?.lastName ?? ''}`.trim()}
              data-created-at={task.createdAt}
            >
              <td className="px-6 py-4 text-sm text-gray-900">{task.id}</td>
              <td className="px-6 py-4 text-sm text-gray-900 hover:underline">
                <Link
                  href={routes.app.tasks.show(task.id)}
                  className="text-gray-900 hover:underline"
                >
                  {task.name}
                </Link>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">{task.status?.name ?? '—'}</td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {task.executor?.firstName} {task.executor?.lastName ?? ''}
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
