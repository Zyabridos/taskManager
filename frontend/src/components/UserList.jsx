import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const UsersList = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('/api/users')
      .then((response) => {
        console.log(response.data)
        setUsers(response.data.users);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  return (
    <div className="container mt-4">
      <h1>{t('views.users.title')}</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>{t('views.users.id')}</th>
            <th>{t('views.users.email')}</th>
            <th>{t('views.users.createdAt')}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;
