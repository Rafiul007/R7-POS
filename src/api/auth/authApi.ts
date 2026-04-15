import axiosInstance from '../../lib/axiosInstance';

const LOGIN_URL = 'iam/api/auth/login';
const LOGOUT_URL = 'iam/api/auth/logout';

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  accessToken: string;
};

const getTokenFromPayload = (payload: unknown): string | undefined => {
  if (!payload || typeof payload !== 'object') return undefined;

  const record = payload as Record<string, unknown>;
  const token =
    record.accessToken ??
    record.access_token ??
    record.token ??
    (typeof record.tokens === 'object' && record.tokens !== null
      ? (record.tokens as Record<string, unknown>).accessToken
      : undefined) ??
    (typeof record.auth === 'object' && record.auth !== null
      ? (record.auth as Record<string, unknown>).accessToken
      : undefined);

  return typeof token === 'string' ? token : undefined;
};

// login function
export const login = async ({
  email,
  password,
}: LoginPayload): Promise<LoginResponse> => {
  const res = await axiosInstance.post(LOGIN_URL, { email, password });
  const payload = res.data?.data ?? res.data;
  const accessToken = getTokenFromPayload(payload);

  if (!accessToken) {
    throw new Error('Login response missing access token.');
  }

  return { accessToken };
};

export const logout = async (): Promise<void> => {
  await axiosInstance.post(LOGOUT_URL, undefined, { withCredentials: true });
};
