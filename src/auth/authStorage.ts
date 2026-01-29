const TOKEN_KEY = 'pos_access_token';

export const getAccessToken = () => localStorage.getItem(TOKEN_KEY);

export const setAccessToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearAccessToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};
