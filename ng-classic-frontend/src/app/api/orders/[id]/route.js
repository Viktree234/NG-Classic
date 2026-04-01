import { getSessionUser } from '@/lib/server/auth';
import { queryOne } from '@/lib/server/db';
import { fail, ok } from '@/lib/server/http';

export async function PATCH(request, { params }) {
  const user = await getSessionUser();
  if (!user || user.role !== 'admin') {
    return fail('Unauthorized', 401);
  }

  const { id } = await params;
  const body = await request.json();

  const order = await queryOne(
    `update orders
     set order_status = $1
     where id = $2
     returning id, user_id, customer_email, items, total_price, order_status, shipping_name, shipping_phone, shipping_address, payment_ref, created_at`,
    [body.order_status, id]
  );

  if (!order) {
    return fail('Order not found.', 404);
  }

  return ok(order);
}
