const USER_KEY = 'authUser';

export type StoredUser = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
};

export const saveUserToStorage = (user: StoredUser | null): void => {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const getUserFromStorage = (): StoredUser | null => {
  const user = localStorage.getItem(USER_KEY);
  return user ? (JSON.parse(user) as StoredUser) : null;
};

export const removeUserFromStorage = (): void => {
  localStorage.removeItem(USER_KEY);
};
