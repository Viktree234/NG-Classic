'use client';
import useSWR from 'swr';
import { listOrders, updateOrderStatus } from '@/lib/api';

const STATUSES = ['Pending', 'Confirmed', 'Delivered'];

const STATUS_COLORS = {
  Pending:   'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  Confirmed: 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  Delivered: 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
};

export default function AdminOrderTable() {
  const { data, mutate } = useSWR(
    ['admin-orders'],
    () => listOrders({ admin: true })
  );
  const orders = data ?? [];

  async function updateStatus(id, orderStatus) {
    await updateOrderStatus(id, orderStatus);
    mutate();
  }

  if (orders.length === 0) {
    return <p className="text-secondary text-center py-12">No orders yet.</p>;
  }

  return (
    <div className="space-y-4">
      {orders.map(order => {
        const username = order.shipping_name || order.customer_email || 'Guest';
        const statusClass = STATUS_COLORS[order.order_status] ?? 'bg-surface-soft text-secondary border-border-subtle';

        return (
          <div key={order.id} className="border border-border-subtle rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
              <div>
                <p className="font-medium text-primary">Order #{order.id}</p>
                <p className="text-sm text-muted">{username} · {new Date(order.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-3 py-1 rounded-full border font-medium ${statusClass}`}>
                  {order.order_status}
                </span>
                <select
                  value={order.order_status}
                  onChange={e => updateStatus(order.id, e.target.value)}
                  className="text-sm border border-border-default rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 bg-surface text-primary"
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="text-sm text-secondary space-y-1 mb-3">
              {(order.items ?? []).map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span>{item.name} × {item.qty}</span>
                  <span>₦{(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>

            {order.shipping_address && (
              <p className="text-xs text-muted mt-2">
                Ship to: {order.shipping_name} · {order.shipping_phone} · {order.shipping_address}
              </p>
            )}

            <div className="border-t border-border-subtle pt-3 mt-3 flex justify-between font-semibold text-heading">
              <span>Total</span>
              <span>₦{Number(order.total_price).toLocaleString()}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
