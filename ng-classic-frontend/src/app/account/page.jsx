'use client';
import { useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import Link from 'next/link';
import { listOrders } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

const STATUS_COLORS = {
  Pending:   'bg-amber-50 text-amber-700 border-amber-200',
  Confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
  Delivered: 'bg-green-50 text-green-700 border-green-200',
};

function subscribe() {
  return () => {};
}

function getOrderSuccessSnapshot() {
  if (typeof window === 'undefined') {
    return false;
  }
  const search = new URLSearchParams(window.location.search);
  return search.get('order') === 'success';
}

export default function AccountPage() {
  const router = useRouter();
  const { user, logout, ready } = useAuthStore();
  const showSuccess = useSyncExternalStore(subscribe, getOrderSuccessSnapshot, () => false);

  useEffect(() => {
    if (ready && !user) router.push('/login');
  }, [ready, user, router]);

  const { data } = useSWR(
    user ? ['orders', user.id] : null,
    ([, userId]) => listOrders({ userId })
  );
  const orders = data ?? [];

  if (!ready || !user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-8 text-sm">
          ✓ Your order has been placed successfully! We&apos;ll confirm shortly.
        </div>
      )}

      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-playfair text-3xl text-rose-900">My Account</h1>
          <p className="text-gray-500 text-sm mt-1">{user.email}</p>
        </div>
        <button onClick={async () => { await logout(); router.push('/'); }} className="btn-outline text-sm px-4 py-2">
          Sign Out
        </button>
      </div>

      <h2 className="font-playfair text-xl text-rose-900 mb-5">Order History</h2>

      {orders.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="mb-4">No orders yet.</p>
          <Link href="/shop" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const statusClass = STATUS_COLORS[order.order_status] ?? 'bg-gray-50 text-gray-600 border-gray-200';
            return (
              <div key={order.id} className="border border-gray-100 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-400">Order #{order.id}</span>
                  <span className={`text-xs px-3 py-1 rounded-full border font-medium ${statusClass}`}>
                    {order.order_status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1 mb-3">
                  {(order.items ?? []).map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{item.name} × {item.qty}</span>
                      <span>₦{(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-medium text-rose-900">
                  <span>Total</span>
                  <span>₦{Number(order.total_price).toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
