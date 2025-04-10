'use client';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStatuses, deleteStatusThunk } from '../../store/slices/statusesSlice';
import { DeleteButton, HrefButton } from '../Buttons';
import { format } from 'date-fns';
import ruLocale from 'date-fns/locale/ru';
import { useTranslation } from 'react-i18next';
import routes from '../../routes';
import useEntityToast from '../../hooks/useEntityToast';
import useSortedList from '../../hooks/useSortableList';
import SortableHeader from '../UI/SortableHeader';
import useHandleToastError from '../../hooks/useHandleErrorToast';

const StatusesList = () => {
  const dispatch = useDispatch();
  const { list, status, error } = useSelector(state => state.statuses);
  console.log(status);
  const { t } = useTranslation('tables');
  const { t: tButtons } = useTranslation('buttons');
  const { t: tStatuses } = useTranslation('statuses');
  const { showToast } = useEntityToast();
  const handleToastError = useHandleToastError(showToast);

  useEffect(() => {
    dispatch(fetchStatuses());
  }, [dispatch]);

  const { sortedList, sortField, sortOrder, handleSort } = useSortedList(list, 'id', 'asc');

  const handleDelete = async id => {
    try {
      await dispatch(deleteStatusThunk(id)).unwrap();
      showToast({
        type: 'status',
        action: 'deleted',
        titleKey: 'successTitle',
      });
    } catch (e) {

      const isInUse = typeof e?.message === 'string' && e.message.includes('in use');

      handleToastError(e, {
        type: 'status',
        action: isInUse ? 'hasTasks' : 'failedDelete',
        titleKey: 'errorTitle',
      });
    }
  };

  if (status === 'loading') return <p>{t('common.loading')}</p>;
  if (status === 'failed') {
    return (
      <p>
        {t('common.error')}: {error}
      </p>
    );
  }

  return (
    <div className="mt-6 overflow-x-auto">
      <div className="pb-2">
        <HrefButton
          href={routes.app.statuses.create()}
          buttonText={tStatuses('form.createTitle')}
        />
      </div>
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
              label={t('statuses.columns.name')}
              field="name"
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
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-700">
              {t('common.columns.actions')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {sortedList.map(status => (
            <tr key={status.id}>
              <td className="px-6 py-4 text-sm text-gray-900">{status.id}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{status.name}</td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {format(new Date(status.createdAt), 'dd.MM.yyyy HH:mm', {
                  locale: ruLocale,
                })}
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap justify-end gap-2">
                  <HrefButton
                    href={routes.app.statuses.edit(status.id)}
                    buttonText={tButtons('edit')}
                  />
                  <DeleteButton onClick={() => handleDelete(status.id)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StatusesList;
