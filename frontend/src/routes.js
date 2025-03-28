const routes = {
  session: {
    new: 'session/new',
  },
  loginPath: '/session',
  logOut: '/',
  users: {
    edit: id => `/users/${id}/edit`,
    list: '/users',
    create: '/users/new',
  },
  statuses: {
    edit: id => `/statuses/${id}/edit`,
    list: '/statuses',
    create: '/statuses/new',
  },
};

export default routes;
