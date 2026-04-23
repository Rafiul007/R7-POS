import { getJwtStringClaim } from './jwt';

const ACCESS_TOKEN_KEY = 'access_token';
const ROLE_KEY = 'auth_role';
const EMPLOYEE_TYPE_KEY = 'auth_employee_type';

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const getStoredRole = () => {
  const storedRole = localStorage.getItem(ROLE_KEY);
  const accessToken = getAccessToken();

  return (
    storedRole ?? (accessToken ? getJwtStringClaim(accessToken, 'role') : null)
  );
};
export const getStoredEmployeeType = () => {
  const storedEmployeeType = localStorage.getItem(EMPLOYEE_TYPE_KEY);
  const accessToken = getAccessToken();

  return (
    storedEmployeeType ??
    (accessToken ? getJwtStringClaim(accessToken, 'employeeType') : null)
  );
};

export const setTokens = (
  accessToken: string,
  role?: string | null,
  employeeType?: string | null
) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (role) {
    localStorage.setItem(ROLE_KEY, role);
  } else {
    localStorage.removeItem(ROLE_KEY);
  }
  if (employeeType) {
    localStorage.setItem(EMPLOYEE_TYPE_KEY, employeeType);
  } else {
    localStorage.removeItem(EMPLOYEE_TYPE_KEY);
  }
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(EMPLOYEE_TYPE_KEY);
};
