'use client';
import useSWR from 'swr';
import { fetchAPI } from '@/lib/api';

const STATUSES = ['Pending', 'Confirmed', 'Delivered'];

const STATUS_COLORS = {
  Pending:   'bg-amber-50 text-amber-700 border-amber-200',
  Confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  Delivered: 'bg-green-50 text-green-700 border-green-200',
};

export default function AdminOrderTable() {
  const { data, mutate } = useSWR('/orders?populate=user&sort=createdAt:desc', fetchAPI);
  const orders = data?.data ?? [];

  async function updateStatus(id, orderStatus) {
    await fetchAPI(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ data: { orderStatus } }),
    });
    mutate();
  }

  if (orders.length === 0) {
    return <p className="text-gray-400 text-center py-12">No orders yet.</p>;
  }

  return (
    <div className="space-y-4">
      {orders.map(order => {
        const a = order.attributes ?? order;
        const username = a.user?.data?.attributes?.username ?? a.user?.username ?? 'Guest';
        const statusClass = STATUS_COLORS[a.orderStatus] ?? 'bg-gray-50 text-gray-600 border-gray-200';

        return (
          <div key={order.id} className="border border-gray-100 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
              <div>
                <p className="font-medium text-gray-900">Order #{order.id}</p>
                <p className="text-sm text-gray-400">{username} · {new Date(a.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-3 py-1 rounded-full border font-medium ${statusClass}`}>
                  {a.orderStatus}
                </span>
                <select
                  value={a.orderStatus}
                  onChange={e => updateStatus(order.id, e.target.value)}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white"
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="text-sm text-gray-600 space-y-1 mb-3">
              {(a.items ?? []).map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span>{item.name} × {item.qty}</span>
                  <span>₦{(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>

            {a.shipping_address && (
              <p className="text-xs text-gray-400 mt-2">
                Ship to: {a.shipping_name} · {a.shipping_phone} · {a.shipping_address}
              </p>
            )}

            <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between font-semibold text-rose-900">
              <span>Total</span>
              <span>₦{Number(a.total_price).toLocaleString()}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
