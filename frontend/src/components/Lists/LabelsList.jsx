'use client';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DeleteButton, HrefButton } from '../Buttons';
import { format } from 'date-fns';
import ruLocale from 'date-fns/locale/ru';
import { useTranslation } from 'react-i18next';
import routes from '../../routes';
import { deleteLabelThunk, fetchLabel } from '../../store/slices/labelsSlice';
import useEntityToast from '../../hooks/useEntityToast';
import useSortedList from '../../hooks/useSortableList';
import SortableHeader from '../UI/SortableHeader';

const LabelsList = () => {
  const dispatch = useDispatch();
  const { list, label, error } = useSelector(state => state.labels);
  const { t } = useTranslation('tables');
  const { t: tButtons } = useTranslation('buttons');
  const { t: tLabels } = useTranslation('labels');
  const { showToast } = useEntityToast();

  useEffect(() => {
    dispatch(fetchLabel());
  }, [dispatch]);

  const { sortedList, sortField, sortOrder, handleSort } = useSortedList(list, 'id', 'asc');

  const handleDelete = async id => {
    try {
      await dispatch(deleteLabelThunk(id)).unwrap();
      showToast({ type: 'label', action: 'deleted', titleKey: 'successTitle' });
    } catch (e) {
      console.log('error during label deleting', e);
      showToast({ type: 'label', action: 'failedDelete', titleKey: 'errorTitle', type: 'error' });
    }
  };

  if (label === 'loading') return <p>{t('common.loading')}</p>;
  if (label === 'failed') {
    return (
      <p>
        {t('common.error')}: {error}
      </p>
    );
  }

  return (
    <div className="mt-6 overflow-x-auto">
      <div className="pb-2">
        <HrefButton href={routes.app.labels.create()} buttonText={tLabels('form.createTitle')} />
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
              label={t('labels.columns.name')}
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
            <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-700 uppercase">
              {t('common.columns.actions')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {sortedList.map(label => (
            <tr key={label.id}>
              <td className="px-6 py-4 text-sm text-gray-900">{label.id}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{label.name}</td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {format(new Date(label.createdAt), 'dd.MM.yyyy HH:mm', { locale: ruLocale })}
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap justify-end gap-2">
                  <HrefButton
                    href={routes.app.labels.edit(label.id)}
                    buttonText={tButtons('edit')}
                  />
                  <DeleteButton onClick={() => handleDelete(label.id)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LabelsList;
