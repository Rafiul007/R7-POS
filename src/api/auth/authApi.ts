import axiosInstance from '../../lib/axiosInstance';

const LOGIN_URL = 'iam/api/auth/login';
const LOGOUT_URL = 'iam/api/auth/logout';

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  accessToken: string;
  role?: string | null;
};

// login function
export const login = async ({
  email,
  password,
}: LoginPayload): Promise<LoginResponse> => {
  const res = await axiosInstance.post(LOGIN_URL, { email, password });
  const payload = res.data?.data ?? res.data;
  const accessToken = payload.accessToken ?? payload.access_token;
  const role = payload.role ?? payload.user?.role ?? null;

  if (!accessToken) {
    throw new Error('Login response missing access token.');
  }

  return { accessToken, role };
};

export const logout = async (): Promise<void> => {
  await axiosInstance.post(LOGOUT_URL, undefined, { withCredentials: true });
};
