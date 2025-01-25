import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const UsersList = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // evnt transfer this to Redux
  // const users = useSelector((state) => state.usersInfo.users);
  useEffect(() => {
    axios.get('/api/users')
      .then((response) => {
        console.log('Users data:', response.data);
        setUsers(response.data.users);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container wrapper flex-grow-1">
      <h1 className="display-4 fw-bold mt-4">{t('views.users.title')}</h1>
      {loading ? (
        <p>{t('views.users.loading')}</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-borderless table-striped mt-5 bg-white">
            <thead>
              <tr>
                <th>{t('views.users.id')}</th>
                <th>{t('views.users.fullName')}</th>
                <th>{t('views.users.email')}</th>
                <th>{t('views.users.createdAt')}</th>
                <th>{t('views.users.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{`${user.firstName} ${user.lastName}`}</td>
                    <td>{user.email}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <a href={`/users/${user.id}/edit`} className="btn btn-sm btn-primary me-2">
                        {t('views.users.edit')}
                      </a>
                      <button className="btn btn-sm btn-danger">
                        {t('views.users.delete')}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">{t('views.users.noUsers')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersList;