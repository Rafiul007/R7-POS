import axiosInstance from '../../lib/axiosInstance';

const LOGIN_URL = 'iam/api/auth/login';

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

// login function
export const login = async ({
  email,
  password,
}: LoginPayload): Promise<LoginResponse> => {
  const res = await axiosInstance.post(LOGIN_URL, { email, password });
  return res.data.data;
};
