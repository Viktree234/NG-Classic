async function request(path, options = {}) {
  const res = await fetch(path, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.error || error?.message || `Request failed with status ${res.status}.`);
  }

  if (res.status === 204) {
    return null;
  }

  return res.json();
}

export async function restoreAuthSession() {
  return request('/api/auth/me');
}

export async function signIn(email, password) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function signUp(username, email, password) {
  return request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  });
}

export async function signOut() {
  await request('/api/auth/logout', { method: 'POST' });
}

export async function fetchCurrentUser() {
  return request('/api/auth/me');
}

export async function listProducts({ category, limit } = {}) {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (limit) params.set('limit', String(limit));
  const query = params.toString();
  return request(`/api/products${query ? `?${query}` : ''}`);
}

export async function getProduct(id) {
  return request(`/api/products/${id}`);
}

export async function saveProduct(product) {
  const payload = {
    name: product.name,
    category: product.category,
    price: Number(product.price),
    stock: Number(product.stock),
    description: product.description || '',
    image_urls: Array.isArray(product.image_urls) ? product.image_urls.filter(Boolean) : [],
  };

  if (product.id) {
    return request(`/api/products/${product.id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  }

  return request('/api/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function deleteProduct(id) {
  await request(`/api/products/${id}`, { method: 'DELETE' });
}

export async function listOrders({ userId, admin = false } = {}) {
  const params = new URLSearchParams();
  if (userId) params.set('userId', String(userId));
  if (admin) params.set('admin', 'true');
  const query = params.toString();
  return request(`/api/orders${query ? `?${query}` : ''}`);
}

export async function createOrder(order) {
  return request('/api/orders', {
    method: 'POST',
    body: JSON.stringify(order),
  });
}

export async function updateOrderStatus(id, orderStatus) {
  return request(`/api/orders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ order_status: orderStatus }),
  });
}

export async function listReviews(productId) {
  return request(`/api/reviews?productId=${productId}`);
}

export async function createReview(review) {
  return request('/api/reviews', {
    method: 'POST',
    body: JSON.stringify(review),
  });
}

export function getProductImageUrl(url) {
  return url || null;
}
