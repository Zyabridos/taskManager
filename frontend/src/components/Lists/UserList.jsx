'use client';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, deleteUserThunk } from '../../store/slices/usersSlice';
import { DeleteButton, HrefButton } from '../Buttons';
import { format } from 'date-fns';
import ruLocale from 'date-fns/locale/ru';
import { useTranslation } from 'react-i18next';
import routes from '../../routes';
import useEntityToast from '../../hooks/useEntityToast';
import useSortedList from '../../hooks/useSortableList';
import SortableHeader from '../UI/SortableHeader';

const UserList = () => {
  const dispatch = useDispatch();
  const { list, status, error } = useSelector(state => state.users);
  const { t } = useTranslation('tables');
  const { t: tButtons } = useTranslation('buttons');
  const { showToast } = useEntityToast();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const { sortedList, sortField, sortOrder, handleSort } = useSortedList(list, 'id', 'asc');

  const handleDelete = async id => {
    try {
      await dispatch(deleteUserThunk(id)).unwrap();
      showToast({ type: 'user', action: 'deleted', titleKey: 'successTitle' });
    } catch (e) {
      const response = e?.response;
      const serverMessage = response?.data?.error;

      const hasUserTasks = typeof serverMessage === 'string' && serverMessage.includes('related tasks');
      const isUserNotOwner = typeof serverMessage === 'string' && serverMessage.includes('own account');

      if (response?.status === 422 && hasUserTasks) {
        showToast({ type: 'user', action: 'hasTasks', titleKey: 'errorTitle', toastType: 'error' });
      } else if (response?.status === 403 && isUserNotOwner) {
        showToast({ type: 'user', action: 'notOwner', titleKey: 'errorTitle', toastType: 'error' });
      } else {
        showToast({
          type: 'user',
          action: 'failedDelete',
          titleKey: 'errorTitle',
          messageKey: 'failedDelete.user',
          toastType: 'error',
        });
      }
    }
  };

  if (status === 'loading') return <p>{t('common.loading')}</p>;
  if (status === 'failed') return <p>{t('common.error')}: {error}</p>;

  return (
    <div className="mt-6 overflow-x-auto">
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
              label={t('users.columns.fullName')}
              field="firstName"
              currentSortField={sortField}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
            <SortableHeader
              label={t('users.columns.email')}
              field="email"
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
          {sortedList.map(user => (
            <tr
              key={user.id}
              data-id={user.id}
              data-email={user.email}
              data-name={`${user.firstName} ${user.lastName}`}
            >
              <td className="px-6 py-4 text-sm text-gray-900">{user.id}</td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {user.firstName} {user.lastName}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {format(new Date(user.createdAt), 'dd.MM.yyyy HH:mm', { locale: ruLocale })}
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap justify-end gap-2">
                  <HrefButton href={routes.app.users.edit(user.id)} buttonText={tButtons('edit')} />
                  <DeleteButton onClick={() => handleDelete(user.id)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
