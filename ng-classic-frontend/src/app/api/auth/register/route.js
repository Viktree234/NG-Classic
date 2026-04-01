import { hashPassword, setSession } from '@/lib/server/auth';
import { queryOne } from '@/lib/server/db';
import { fail, ok } from '@/lib/server/http';

export async function POST(request) {
  const body = await request.json();
  const username = body?.username?.trim();
  const email = body?.email?.trim().toLowerCase();
  const password = body?.password;

  if (!username || !email || !password) {
    return fail('Username, email, and password are required.');
  }

  const existing = await queryOne('select id from users where email = $1', [email]);
  if (existing) {
    return fail('An account with that email already exists.', 409);
  }

  const user = await queryOne(
    `insert into users (username, email, password_hash, role)
     values ($1, $2, $3, 'customer')
     returning id, username, email, role`,
    [username, email, hashPassword(password)]
  );

  await setSession(user);
  return ok({ user }, { status: 201 });
}
