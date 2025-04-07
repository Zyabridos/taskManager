'use client';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, deleteUserThunk } from '../../store/slices/usersSlice';
import { DeleteButton } from '../Buttons';
import { format } from 'date-fns';
import ruLocale from 'date-fns/locale/ru';
import { useTranslation } from 'react-i18next';
import routes from '../../routes';
import useEntityToast from '../../hooks/useEntityToast';
import useSortedList from '../../hooks/useSortableList';
import SortableHeader from '../UI/SortableHeader';
import { useAuth } from '../../context/authContex';
import { HrefButton } from '../Buttons';
import useHandleToastError from '../../hooks/useHandleErrorToast';

const UserList = () => {
  const dispatch = useDispatch();
  const { list, status, error } = useSelector(state => state.users);
  const { t } = useTranslation('tables');
  const { t: tButtons } = useTranslation('buttons');
  const { showToast } = useEntityToast();
  const handleToastError = useHandleToastError(showToast);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    dispatch(fetchUsers());

    if (sessionStorage.getItem('toast_forbidden_edit')) {
      sessionStorage.removeItem('toast_forbidden_edit');
      showToast({
        type: 'user',
        action: 'notOwner',
        titleKey: 'errorTitle',
        toastType: 'error',
        message: 'К сожалению, вы не можете редактировать других пользователей',
      });
    }
  }, [dispatch, showToast]);

  const { sortedList, sortField, sortOrder, handleSort } = useSortedList(list, 'id', 'asc');

  const handleDelete = async id => {
    try {
      await dispatch(deleteUserThunk(id)).unwrap();
      showToast({ type: 'user', action: 'deleted', titleKey: 'successTitle' });
    } catch (e) {
      const message = e?.response?.data?.message;

      console.log('error message:', message);

      if (message.includes('edit other users')) {
        showToast({
          type: 'user',
          action: 'user.errors.notOwnerEdit',
          titleKey: 'errorTitle',
          toastType: 'error',
        });
      } else {
        handleToastError(e, { type: 'user', action: 'failedDelete', titleKey: 'errorTitle' });
      }
    }
  };

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <SortableHeader
              label={t('common.columns.id')}
              field="id"
              {...{ sortField, sortOrder, onSort: handleSort }}
            />
            <SortableHeader
              label={t('users.columns.fullName')}
              field="firstName"
              {...{ sortField, sortOrder, onSort: handleSort }}
            />
            <SortableHeader
              label={t('users.columns.email')}
              field="email"
              {...{ sortField, sortOrder, onSort: handleSort }}
            />
            <SortableHeader
              label={t('common.columns.createdAt')}
              field="createdAt"
              {...{ sortField, sortOrder, onSort: handleSort }}
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
