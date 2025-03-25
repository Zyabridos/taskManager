'use client';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from '../store/slices/usersSlice';

const UserList = () => {
  const dispatch = useDispatch();
  const { list, status, error } = useSelector(state => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'failed') return <p>Error: {error}</p>;

  return (
    <div className="mx-auto mt-8 max-w-2xl rounded bg-white p-4 shadow">
      <h2 className="mb-4 text-2xl font-bold">Список пользователей</h2>
      <ul className="divide-y divide-gray-200">
        {list.map(user => (
          <li key={user.id} className="py-2">
            <p className="text-5xl text-lg font-medium">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
