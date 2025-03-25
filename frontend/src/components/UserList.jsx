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
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Список пользователей</h2>
      <ul className="divide-y divide-gray-200">
        {list.map(user => (
          <li key={user.id} className="py-2">
            <p className="text-lg font-medium text-5xl">{user.firstName} {user.lastName}</p>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
