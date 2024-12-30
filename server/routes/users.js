const userRoutes = {
  // list of all users
  usersPath: '/users',
  // particular user
  userPath: (id) => `/users/${id}`,
  // edit user
  editUserPath: (id) => `/users/${id}/edit`,
};

export default userRoutes;
