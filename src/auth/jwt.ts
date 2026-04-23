type JwtPayload = Record<string, unknown>;

export const decodeJwtPayload = (token: string): JwtPayload | null => {
  const [, payload] = token.split('.');

  if (!payload) {
    return null;
  }

  try {
    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const paddedPayload = normalizedPayload.padEnd(
      normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
      '='
    );
    const binaryPayload = globalThis.atob(paddedPayload);
    const payloadBytes = Uint8Array.from(binaryPayload, character =>
      character.charCodeAt(0)
    );
    const decodedPayload = new TextDecoder().decode(payloadBytes);

    return JSON.parse(decodedPayload) as JwtPayload;
  } catch {
    return null;
  }
};

export const getJwtStringClaim = (
  token: string,
  claim: string
): string | null => {
  const value = decodeJwtPayload(token)?.[claim];

  return typeof value === 'string' ? value : null;
};
