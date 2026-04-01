import { setSession, verifyPassword } from '@/lib/server/auth';
import { queryOne } from '@/lib/server/db';
import { fail, ok } from '@/lib/server/http';

export async function POST(request) {
  const body = await request.json();
  const email = body?.email?.trim().toLowerCase();
  const password = body?.password;

  if (!email || !password) {
    return fail('Email and password are required.');
  }

  const user = await queryOne(
    `select id, username, email, role, password_hash
     from users
     where email = $1`,
    [email]
  );

  if (!user || !verifyPassword(password, user.password_hash)) {
    return fail('Invalid email or password.', 401);
  }

  await setSession(user);
  return ok({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
}
