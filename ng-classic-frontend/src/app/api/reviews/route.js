import { getSessionUser } from '@/lib/server/auth';
import { query, queryOne } from '@/lib/server/db';
import { fail, ok } from '@/lib/server/http';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');

  if (!productId) {
    return fail('productId is required.');
  }

  const reviews = await query(
    `select id, product_id, user_id, username, rating, comment, created_at
     from reviews
     where product_id = $1
     order by created_at desc`,
    [productId]
  );

  return ok(reviews);
}

export async function POST(request) {
  const user = await getSessionUser();
  if (!user) {
    return fail('Unauthorized', 401);
  }

  const body = await request.json();
  const review = await queryOne(
    `insert into reviews (product_id, user_id, username, rating, comment)
     values ($1, $2, $3, $4, $5)
     returning id, product_id, user_id, username, rating, comment, created_at`,
    [
      body.product_id,
      user.id,
      user.username,
      Number(body.rating),
      body.comment,
    ]
  );

  return ok(review, { status: 201 });
}
