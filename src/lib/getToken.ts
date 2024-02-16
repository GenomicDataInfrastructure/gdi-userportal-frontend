import type { Session } from 'next-auth';
import { getServerSession } from 'next-auth';
import { authOptions } from '../app/api/auth/[...nextauth]/route';
import { decrypt } from './encryption';

type ExtendedSession = Session & { id_token: string; access_token: string };

export async function getToken(tokenType: 'access_token' | 'id_token') {
  const session = (await getServerSession(authOptions)) as ExtendedSession;
  if (session) {
    const tokenDecrypted = decrypt(session[tokenType]!);
    return tokenDecrypted;
  }
  return null;
}
