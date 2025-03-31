'use client';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DeleteButton, HrefButton } from '../Buttons';
import { format } from 'date-fns';
import ruLocale from 'date-fns/locale/ru';
import { useTranslation } from 'react-i18next';
import routes from '../../routes';
import { deleteLabelThunk, fetchLabel } from '../../store/slices/labelsSlice';
import useToast from '../../hooks/useToast';
import { useRouter } from 'next/navigation';

const LabelsList = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { list, label, error } = useSelector(state => state.labels);
  const { t } = useTranslation('tables');
  const { t: tButtons } = useTranslation('buttons');
  const { t: tLabels } = useTranslation('labels');
  useToast();

  useEffect(() => {
    dispatch(fetchLabel());
  }, [dispatch]);

  const handleDelete = async id => {
    try {
      await dispatch(deleteLabelThunk(id));
      router.push(`${routes.app.statuses.list()}?deleted=label`);
    } catch (e) {
      alert(t('common.deleteError'));
    }
  };

  if (label === 'loading') return <p>{t('common.loading')}</p>;
  if (label === 'failed')
    return (
      <p>
        {t('common.error')}: {error}
      </p>
    );

  return (
    <div className="mt-6 overflow-x-auto">
      <div className="pb-2">
        <HrefButton href={routes.app.labels.create()} buttonText={tLabels('form.createTitle')} />
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-700 uppercase">
              {t('common.columns.id')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-700 uppercase">
              {t('labels.columns.name')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-700 uppercase">
              {t('common.columns.createdAt')}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-700 uppercase">
              {t('common.columns.actions')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {list.map(label => (
            <tr key={label.id}>
              <td className="px-6 py-4 text-sm text-gray-900">{label.id}</td>
              <td className="px-6 py-4 text-sm text-gray-900">{label.name}</td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {format(new Date(label.createdAt), 'dd.MM.yyyy HH:mm', {
                  locale: ruLocale,
                })}
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
