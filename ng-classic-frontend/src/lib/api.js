const BASE = process.env.NEXT_PUBLIC_STRAPI_URL;

function getToken() {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/jwt=([^;]+)/);
  return match ? match[1] : null;
}

export async function fetchAPI(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}/api${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.error?.message || `API error: ${res.status}`);
  }
  return res.json();
}

export async function login(identifier, password) {
  const res = await fetch(`${BASE}/api/auth/local`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
  });
  if (!res.ok) throw new Error('Invalid credentials');
  return res.json();
}

export async function register(username, email, password) {
  const res = await fetch(`${BASE}/api/auth/local/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  if (!res.ok) throw new Error('Registration failed');
  return res.json();
}

export function getStrapiMedia(url) {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${BASE}${url}`;
}
