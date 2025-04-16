const apiBase = '/api';

// URL | from DB
type Id = string | number;

const apiRoutes = {
  session: {
    new: (): string => [apiBase, 'session', 'new'].join('/'),
    current: (): string => [apiBase, 'session'].join('/'),
    delete: (): string => [apiBase, 'session'].join('/'),
  },
  users: {
    list: (): string => [apiBase, 'users'].join('/'),
    create: (): string => [apiBase, 'users', 'new'].join('/'),
    show: (id: Id): string => [apiBase, 'users', id].join('/'),
    edit: (id: Id): string => [apiBase, 'users', id, 'edit'].join('/'),
  },
  statuses: {
    list: (): string => [apiBase, 'statuses'].join('/'),
    create: (): string => [apiBase, 'statuses', 'new'].join('/'),
    show: (id: Id): string => [apiBase, 'statuses', id].join('/'),
    edit: (id: Id): string => [apiBase, 'statuses', id, 'edit'].join('/'),
  },
  labels: {
    list: (): string => [apiBase, 'labels'].join('/'),
    create: (): string => [apiBase, 'labels', 'new'].join('/'),
    show: (id: Id): string => [apiBase, 'labels', id].join('/'),
    edit: (id: Id): string => [apiBase, 'labels', id, 'edit'].join('/'),
  },
  tasks: {
    list: (): string => [apiBase, 'tasks'].join('/'),
    create: (): string => [apiBase, 'tasks', 'new'].join('/'),
    show: (id: Id): string => [apiBase, 'tasks', id].join('/'),
    edit: (id: Id): string => [apiBase, 'tasks', id, 'edit'].join('/'),
  },
};

const frontendRoutes = {
  home: (): string => '/',
  session: {
    new: (): string => '/session/new',
    current: (): string => '/session',
  },
  users: {
    list: (): string => '/users',
    create: (): string => '/users/new',
    edit: (id: Id): string => `/users/${id}/edit`,
  },
  statuses: {
    list: (): string => '/statuses',
    create: (): string => '/statuses/new',
    edit: (id: Id): string => `/statuses/${id}/edit`,
  },
  labels: {
    list: (): string => '/labels',
    create: (): string => '/labels/new',
    edit: (id: Id): string => `/labels/${id}/edit`,
  },
  tasks: {
    list: (): string => '/tasks',
    create: (): string => '/tasks/new',
    edit: (id: Id): string => `/tasks/${id}/edit`,
    show: (id: Id): string => `/tasks/${id}`,
  },
};

const routes = {
  api: apiRoutes,
  app: frontendRoutes,
};

export default routes;
