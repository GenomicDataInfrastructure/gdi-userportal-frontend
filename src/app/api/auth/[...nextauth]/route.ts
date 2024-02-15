import type { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import Keycloack from 'next-auth/providers/keycloak';

export const authOptions: NextAuthOptions = {
  providers: [
    Keycloack({
      clientId: `${process.env.KEYCLOAK_CLIENT_ID}`,
      clientSecret: `${process.env.KEYCLOAK_CLIENT_SECRET}`,
      issuer: process.env.KEYCLOAK_ISSUER_URL,
      authorization: { params: { scope: 'openid profile email offline_access' } },
    }),
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
