const ACCESS_TOKEN_KEY = 'access_token';
const ROLE_KEY = 'auth_role';

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const getStoredRole = () => localStorage.getItem(ROLE_KEY);

export const setTokens = (accessToken: string, role?: string | null) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (role) {
    localStorage.setItem(ROLE_KEY, role);
  } else {
    localStorage.removeItem(ROLE_KEY);
  }
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
};
