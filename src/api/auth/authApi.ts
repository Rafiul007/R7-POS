import axiosInstance from '../../lib/axiosInstance';
import { getJwtStringClaim } from '../../auth/jwt';

const LOGIN_URL = 'iam/api/auth/login';
const LOGOUT_URL = 'iam/api/auth/logout';
const ALLOWED_LOGIN_ROLES = new Set(['admin', 'staff', 'employee']);
export const LOGIN_PERMISSION_ERROR =
  "You don't have permission to access this app.";

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  accessToken: string;
  role?: string | null;
  employeeType?: string | null;
};

const normalizePermissionValue = (value?: string | null) =>
  value?.trim().toLowerCase() ?? null;

// login function
export const login = async ({
  email,
  password,
}: LoginPayload): Promise<LoginResponse> => {
  const res = await axiosInstance.post(LOGIN_URL, { email, password });
  const payload = res.data?.data ?? res.data;
  const accessToken = payload.accessToken ?? payload.access_token;

  if (!accessToken) {
    throw new Error('Login response missing access token.');
  }

  const role =
    payload.role ??
    payload.user?.role ??
    getJwtStringClaim(accessToken, 'role');
  const employeeType =
    payload.employeeType ??
    payload.user?.employeeType ??
    getJwtStringClaim(accessToken, 'employeeType');
  const normalizedRole = normalizePermissionValue(role);

  if (!normalizedRole || !ALLOWED_LOGIN_ROLES.has(normalizedRole)) {
    throw new Error(LOGIN_PERMISSION_ERROR);
  }

  return { accessToken, role, employeeType };
};

export const logout = async (): Promise<void> => {
  await axiosInstance.post(LOGOUT_URL, undefined, { withCredentials: true });
};
