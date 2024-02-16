import { getToken } from '@/lib/getToken';
import { getServerSession } from 'next-auth';
import { authOptions } from '../[...nextauth]/route';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (session) {
    const idToken = await getToken('id_token');

    // this will log out the user on Keycloak side
    const url = `${process.env.END_SESSION_URL}?id_token_hint=${idToken}&post_logout_redirect_uri=${encodeURIComponent(process.env.NEXTAUTH_URL!)}`;

    try {
      await fetch(url, { method: 'GET' });
    } catch (err) {
      return new Response(null, { status: 500 });
    }
  }
  return new Response(null, { status: 200 });
}
