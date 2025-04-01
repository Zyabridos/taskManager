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

const StatusesList = () => {
  const dispatch = useDispatch();
  const { list, status, error } = useSelector(state => state.statuses);
  const { t } = useTranslation('tables');
  const { t: tButtons } = useTranslation('buttons');
  const { t: tStatuses } = useTranslation('statuses');

  const { showToast } = useEntityToast();

  useEffect(() => {
    dispatch(fetchStatuses());
  }, [dispatch]);

  const handleDelete = async id => {
    try {
      await dispatch(deleteStatusThunk(id)).unwrap();
      showToast({ type: 'status', action: 'deleted', titleKey: 'successTitle' });
    } catch (e) {
      showToast({ type: 'status', action: 'failedDelete', titleKey: 'errorTitle', type: 'error' });
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
        <HrefButton
          href={routes.app.statuses.create()}
          buttonText={tStatuses('form.createTitle')}
        />
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
              {t('common.columns.id')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
              {t('statuses.columns.name')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
              {t('common.columns.createdAt')}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-700">
              {t('common.columns.actions')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {list.map(status => (
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
