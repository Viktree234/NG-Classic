'use client';
import { useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import Link from 'next/link';
import { listOrders } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

const STATUS_COLORS = {
  Pending:   'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  Confirmed: 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  Delivered: 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
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
        <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-xl p-4 mb-8 text-sm">
          ✓ Your order has been placed successfully! We&apos;ll confirm shortly.
        </div>
      )}

      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-playfair text-3xl text-heading">My Account</h1>
          <p className="text-secondary text-sm mt-1">{user.email}</p>
        </div>
        <button onClick={async () => { await logout(); router.push('/'); }} className="btn-outline text-sm px-4 py-2">
          Sign Out
        </button>
      </div>

      <h2 className="font-playfair text-xl text-heading mb-5">Order History</h2>

      {orders.length === 0 ? (
        <div className="text-center py-16 text-secondary">
          <p className="mb-4">No orders yet.</p>
          <Link href="/shop" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const statusClass = STATUS_COLORS[order.order_status] ?? 'bg-surface-soft text-secondary border-border-subtle';
            return (
              <div key={order.id} className="border border-border-subtle rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted">Order #{order.id}</span>
                  <span className={`text-xs px-3 py-1 rounded-full border font-medium ${statusClass}`}>
                    {order.order_status}
                  </span>
                </div>
                <div className="text-sm text-secondary space-y-1 mb-3">
                  {(order.items ?? []).map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{item.name} × {item.qty}</span>
                      <span>₦{(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border-subtle pt-3 flex justify-between font-medium text-heading">
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
