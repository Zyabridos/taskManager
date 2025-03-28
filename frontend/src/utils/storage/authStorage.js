const USER_KEY = 'authUser';

export const saveUserToStorage = (user) => {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const getUserFromStorage = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const removeUserFromStorage = () => {
  localStorage.removeItem(USER_KEY);
};
