import { getSessionUser } from '@/lib/server/auth';
import { query, queryOne } from '@/lib/server/db';
import { fail, ok } from '@/lib/server/http';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const limit = searchParams.get('limit');

  const values = [];
  const where = [];

  if (category) {
    values.push(category);
    where.push(`category = $${values.length}`);
  }

  let sql = `
    select id, name, category, price, stock, description, image_urls, created_at
    from products
  `;

  if (where.length) {
    sql += ` where ${where.join(' and ')}`;
  }

  sql += ' order by created_at desc';

  if (limit) {
    values.push(Number(limit));
    sql += ` limit $${values.length}`;
  }

  const products = await query(sql, values);
  return ok(products);
}

export async function POST(request) {
  const user = await getSessionUser();
  if (!user || user.role !== 'admin') {
    return fail('Unauthorized', 401);
  }

  const body = await request.json();
  const product = await queryOne(
    `insert into products (name, category, price, stock, description, image_urls)
     values ($1, $2, $3, $4, $5, $6)
     returning id, name, category, price, stock, description, image_urls, created_at`,
    [
      body.name,
      body.category,
      Number(body.price),
      Number(body.stock),
      body.description ?? '',
      body.image_urls ?? [],
    ]
  );

  return ok(product, { status: 201 });
}
