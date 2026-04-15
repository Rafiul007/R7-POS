const ACCESS_TOKEN_KEY = 'access_token';

export const normalizeAccessToken = (accessToken?: string | null) => {
  if (!accessToken) return null;

  const token = accessToken.trim().replace(/^Bearer\s+/i, '');
  return token || null;
};

export const getAccessToken = () =>
  normalizeAccessToken(localStorage.getItem(ACCESS_TOKEN_KEY));

export const getRoleFromAccessToken = (accessToken: string) => {
  try {
    const payload = accessToken.split('.')[1];
    if (!payload) return null;

    const normalizedPayload = payload
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(Math.ceil(payload.length / 4) * 4, '=');
    const decodedPayload = JSON.parse(atob(normalizedPayload)) as {
      role?: unknown;
      roles?: unknown;
    };

    if (typeof decodedPayload.role === 'string') {
      return decodedPayload.role;
    }

    if (
      Array.isArray(decodedPayload.roles) &&
      typeof decodedPayload.roles[0] === 'string'
    ) {
      return decodedPayload.roles[0];
    }

    return null;
  } catch {
    return null;
  }
};

export const setTokens = (accessToken: string) => {
  const token = normalizeAccessToken(accessToken);

  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};
