import { jwtDecode } from 'jwt-decode';
import type { JWT } from 'next-auth/jwt';

async function refreshAccessToken(token: JWT) {
  const response = await fetch(`${process.env.REFRESH_TOKEN_URL}`, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: `${process.env.KEYCLOAK_CLIENT_ID}`,
      grant_type: 'refresh_token',
      refresh_token: token.refresh_token as string,
    }),
    method: 'POST',
  });
  const refreshToken = await response.json();
  if (!response.ok) throw refreshToken;

  return {
    ...token,
    access_token: refreshToken.access_token,
    id_token: refreshToken.id_token,
    decoded: jwtDecode(refreshToken.access_token),
    expires_at: Math.floor(Date.now() / 1000) + refreshToken.expires_in,
    refresh_token: refreshToken.refresh_token,
  };
}

export { refreshAccessToken };
