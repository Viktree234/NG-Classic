import { cookies } from 'next/headers';
import crypto from 'node:crypto';
import { queryOne } from '@/lib/server/db';

const SESSION_COOKIE = 'ng_classic_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

function sessionSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error('AUTH_SECRET is required.');
  }
  return secret;
}

function base64url(value) {
  return Buffer.from(value).toString('base64url');
}

function unbase64url(value) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function sign(value) {
  return crypto.createHmac('sha256', sessionSecret()).update(value).digest('base64url');
}

function pack(payload) {
  const encoded = base64url(JSON.stringify(payload));
  return `${encoded}.${sign(encoded)}`;
}

function unpack(token) {
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) {
    return null;
  }

  const expected = sign(encoded);
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return null;
  }

  const payload = JSON.parse(unbase64url(encoded));
  if (!payload?.userId || !payload?.exp || payload.exp < Date.now()) {
    return null;
  }

  return payload;
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

export function verifyPassword(password, stored) {
  const [salt, expected] = String(stored || '').split(':');
  if (!salt || !expected) {
    return false;
  }
  const actual = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
}

export async function setSession(user) {
  const payload = {
    userId: user.id,
    role: user.role,
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  };

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, pack(payload), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }

  const payload = unpack(token);
  if (!payload) {
    return null;
  }

  return queryOne(
    `select id, email, username, role
     from users
     where id = $1`,
    [payload.userId]
  );
}
