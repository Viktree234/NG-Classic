import { getSessionUser } from '@/lib/server/auth';
import { fail, ok } from '@/lib/server/http';

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return fail('Unauthorized', 401);
  }

  return ok({ user });
}
