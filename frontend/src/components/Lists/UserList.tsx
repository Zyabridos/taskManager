'use client';

import React, { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

import { fetchUsers, deleteUserThunk } from '../../store/slices/usersSlice';
import { DeleteButton, HrefButton } from '../Buttons';
import SortableHeader from '../UI/SortableHeader';
import routes from '../../routes';
import store from '../../store';
import useEntityToast from '../../hooks/useEntityToast';
import useSortedList from '../../hooks/useSortableList';
import { useAuth } from '../../context/authContex';
import useHandleToastError from '../../hooks/useHandleErrorToast';
import { User } from '../../types/entities';

const UserList: React.FC = () => {
  const dispatch = store.dispatch;
  const { list } = useSelector(() => store.getState().users);
  const { t } = useTranslation('tables');
  const { t: tButtons } = useTranslation('buttons');
  const { showToast } = useEntityToast();
  const handleToastError = useHandleToastError(showToast);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    const shouldShowToast = sessionStorage.getItem('toast_forbidden_edit');
    if (shouldShowToast) {
      showToast({
        type: 'user',
        action: 'notOwnerEdit',
        titleKey: 'errorTitle',
        toastType: 'error',
      });
      sessionStorage.removeItem('toast_forbidden_edit');
    }
  }, [showToast]);

  const { sortedList, sortField, sortOrder, handleSort } = useSortedList<User>(list, 'id', 'asc');

  const handleDelete = useCallback(
    async (id: number) => {
      try {
        await dispatch(deleteUserThunk(id)).unwrap();
        showToast({ type: 'user', action: 'deleted', titleKey: 'successTitle' });
      } catch (e: any) {
        const message = e?.response?.data?.message;

        if (message?.includes?.('edit other users')) {
          showToast({
            type: 'user',
            action: 'user.errors.notOwnerEdit',
            titleKey: 'errorTitle',
            toastType: 'error',
          });
        } else {
          handleToastError(e, {
            type: 'user',
            action: 'failedDelete',
            titleKey: 'errorTitle',
          });
        }
      }
    },
    [dispatch, showToast, handleToastError],
  );

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
            <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-700 uppercase">
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
              data-name={`${user.firstName} ${user.lastName ?? ''}`}
              data-created-at={user.createdAt}
            >
              <td className="px-6 py-4 text-sm text-gray-900">{user.id}</td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {user.firstName} {user.lastName ?? ''}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {format(new Date(user.createdAt), 'dd.MM.yyyy HH:mm', { locale: ru })}
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap justify-end gap-2">
                  {user.id === currentUser?.id ? (
                    <>
                      <HrefButton
                        href={routes.app.users.edit(user.id)}
                        buttonText={tButtons('edit')}
                      />
                      <DeleteButton onClick={() => handleDelete(user.id)} />
                    </>
                  ) : (
                    <HrefButton href={`mailto:${user.email}`} buttonText={tButtons('sendEmail')} />
                  )}
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
