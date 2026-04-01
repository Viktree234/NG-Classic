import { getSessionUser } from '@/lib/server/auth';
import { queryOne } from '@/lib/server/db';
import { fail, ok } from '@/lib/server/http';

export async function GET(_request, { params }) {
  const { id } = await params;
  const product = await queryOne(
    `select id, name, category, price, stock, description, image_urls, created_at
     from products
     where id = $1`,
    [id]
  );

  if (!product) {
    return fail('Product not found.', 404);
  }

  return ok(product);
}

export async function PATCH(request, { params }) {
  const user = await getSessionUser();
  if (!user || user.role !== 'admin') {
    return fail('Unauthorized', 401);
  }

  const { id } = await params;
  const body = await request.json();
  const product = await queryOne(
    `update products
     set name = $1,
         category = $2,
         price = $3,
         stock = $4,
         description = $5,
         image_urls = $6
     where id = $7
     returning id, name, category, price, stock, description, image_urls, created_at`,
    [
      body.name,
      body.category,
      Number(body.price),
      Number(body.stock),
      body.description ?? '',
      body.image_urls ?? [],
      id,
    ]
  );

  if (!product) {
    return fail('Product not found.', 404);
  }

  return ok(product);
}

export async function DELETE(_request, { params }) {
  const user = await getSessionUser();
  if (!user || user.role !== 'admin') {
    return fail('Unauthorized', 401);
  }

  const { id } = await params;
  const product = await queryOne(
    `delete from products
     where id = $1
     returning id`,
    [id]
  );

  if (!product) {
    return fail('Product not found.', 404);
  }

  return new Response(null, { status: 204 });
}
