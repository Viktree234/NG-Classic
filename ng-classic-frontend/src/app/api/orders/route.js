import { getSessionUser } from '@/lib/server/auth';
import { query, queryOne } from '@/lib/server/db';
import { fail, ok } from '@/lib/server/http';

export async function GET(request) {
  const user = await getSessionUser();
  if (!user) {
    return fail('Unauthorized', 401);
  }

  const { searchParams } = new URL(request.url);
  const wantsAdmin = searchParams.get('admin') === 'true';

  if (wantsAdmin && user.role !== 'admin') {
    return fail('Unauthorized', 401);
  }

  const orders = wantsAdmin
    ? await query(
        `select id, user_id, customer_email, items, total_price, order_status, shipping_name, shipping_phone, shipping_address, payment_ref, created_at
         from orders
         order by created_at desc`
      )
    : await query(
        `select id, user_id, customer_email, items, total_price, order_status, shipping_name, shipping_phone, shipping_address, payment_ref, created_at
         from orders
         where user_id = $1
         order by created_at desc`,
        [user.id]
      );

  return ok(orders);
}

export async function POST(request) {
  const body = await request.json();

  const order = await queryOne(
    `insert into orders (
      user_id, customer_email, items, total_price, order_status, shipping_name, shipping_phone, shipping_address, payment_ref
     ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     returning id, user_id, customer_email, items, total_price, order_status, shipping_name, shipping_phone, shipping_address, payment_ref, created_at`,
    [
      body.user_id ?? null,
      body.customer_email ?? null,
      JSON.stringify(body.items ?? []),
      Number(body.total_price),
      body.order_status ?? 'Pending',
      body.shipping_name,
      body.shipping_phone,
      body.shipping_address,
      body.payment_ref,
    ]
  );

  return ok(order, { status: 201 });
}
