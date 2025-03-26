const routes = {
  users: {
    edit: id => `/users/${id}/edit`,
    list: '/users',
    create: '/users/new',
  },
  session: {
    new: '/session/new',
  },
};

export default routes;
