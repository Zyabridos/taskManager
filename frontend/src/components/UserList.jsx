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
    <ul>
      {list.map((user) => (
        <li key={user.id}>
          {user.firstName} {user.lastName} ({user.email})
        </li>
      ))}
    </ul>
  );
};

export default UserList;
