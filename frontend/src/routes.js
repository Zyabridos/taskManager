const apiBase = '/api';
const frontendBase = '';

const apiRoutes = {
  session: {
    new: () => [apiBase, 'session', 'new'].join('/'),
    current: () => [apiBase, 'session'].join('/'),
    delete: () => [apiBase, 'session'].join('/'),
  },
  users: {
    list: () => [apiBase, 'users'].join('/'),
    create: () => [apiBase, 'users', 'new'].join('/'),
    show: id => [apiBase, 'users', id].join('/'),
    edit: id => [apiBase, 'users', id, 'edit'].join('/'),
  },
  statuses: {
    list: () => [apiBase, 'statuses'].join('/'),
    create: () => [apiBase, 'statuses', 'new'].join('/'),
    show: id => [apiBase, 'statuses', id].join('/'),
    edit: id => [apiBase, 'statuses', id, 'edit'].join('/'),
  },
  labels: {
    list: () => [apiBase, 'labels'].join('/'),
    create: () => [apiBase, 'labels', 'new'].join('/'),
    show: id => [apiBase, 'labels', id].join('/'),
    edit: id => [apiBase, 'labels', id, 'edit'].join('/'),
  },
  tasks: {
    list: () => [apiBase, 'tasks'].join('/'),
    create: () => [apiBase, 'tasks', 'new'].join('/'),
    show: id => [apiBase, 'tasks', id].join('/'),
    edit: id => [apiBase, 'tasks', id, 'edit'].join('/'),
  },
};

const frontendRoutes = {
  home: () => '/',
  session: {
    new: () => '/session/new',
    current: () => '/session',
  },
  users: {
    list: () => '/users',
    create: () => '/users/new',
    edit: id => `/users/${id}/edit`,
  },
  statuses: {
    list: () => '/statuses',
    create: () => '/statuses/new',
    edit: id => `/statuses/${id}/edit`,
  },
  labels: {
    list: () => '/labels',
    create: () => '/labels/new',
    edit: id => `/labels/${id}/edit`,
  },
};

const routes = {
  api: apiRoutes,
  app: frontendRoutes,
};

export default routes;
