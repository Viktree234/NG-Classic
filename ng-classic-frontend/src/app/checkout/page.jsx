'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { fetchAPI } from '@/lib/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <p className="text-gray-400 mb-6">Your cart is empty.</p>
        <Link href="/shop" className="btn-primary">Shop Now</Link>
      </div>
    );
  }

  async function saveOrder(ref) {
    await fetchAPI('/orders', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          user: user?.id ?? null,
          items: items.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
          total_price: total(),
          orderStatus: 'Pending',
          shipping_name: form.name,
          shipping_phone: form.phone,
          shipping_address: form.address,
          payment_ref: ref ?? 'whatsapp',
        },
      }),
    });
  }

  function payWithPaystack() {
    if (!form.name || !form.address || !form.phone) {
      alert('Please fill in all shipping details.');
      return;
    }
    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_KEY,
      email: user?.email ?? `${form.phone}@ngclassic.com`,
      amount: total() * 100,
      currency: 'NGN',
      callback: async (res) => {
        setLoading(true);
        try {
          await saveOrder(res.reference);
          clearCart();
          router.push('/account?order=success');
        } catch (e) {
          alert('Order saved but confirmation failed. Please contact us.');
        } finally {
          setLoading(false);
        }
      },
      onClose: () => {},
    });
    handler.openIframe();
  }

  function orderViaWhatsApp() {
    const lines = items.map(i => `• ${i.name} x${i.qty} = ₦${(i.price * i.qty).toLocaleString()}`).join('%0A');
    const msg = `Hi NG Classic! I'd like to place an order:%0A%0A${lines}%0A%0ATotal: ₦${total().toLocaleString()}%0A%0AName: ${form.name}%0APhone: ${form.phone}%0AAddress: ${form.address}`;
    window.open(`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  }

  return (
    <>
      <script src="https://js.paystack.co/v1/inline.js" async />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="font-playfair text-3xl text-rose-900 mb-8">Checkout</h1>

        {/* Order summary */}
        <div className="bg-rose-50 rounded-2xl p-6 mb-8">
          <h2 className="font-medium text-rose-900 mb-4">Order Summary</h2>
          {items.map(item => (
            <div key={item.id} className="flex justify-between text-sm text-gray-700 py-1">
              <span>{item.name} × {item.qty}</span>
              <span>₦{(item.price * item.qty).toLocaleString()}</span>
            </div>
          ))}
          <div className="border-t border-rose-200 mt-4 pt-4 flex justify-between font-semibold text-rose-900">
            <span>Total</span>
            <span>₦{total().toLocaleString()}</span>
          </div>
        </div>

        {/* Shipping form */}
        <div className="space-y-4 mb-8">
          <h2 className="font-medium text-rose-900">Shipping Details</h2>
          <input className="input-field" placeholder="Full name" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} />
          <input className="input-field" placeholder="Phone number" type="tel" value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })} />
          <textarea className="input-field resize-none" rows={3} placeholder="Delivery address"
            value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
        </div>

        {/* Payment buttons */}
        <div className="flex flex-col gap-3">
          <button onClick={payWithPaystack} disabled={loading} className="btn-primary">
            {loading ? 'Processing...' : `Pay with Paystack — ₦${total().toLocaleString()}`}
          </button>
          <button onClick={orderViaWhatsApp} className="btn-whatsapp">
            Order via WhatsApp
          </button>
        </div>

        {!user && (
          <p className="text-center text-sm text-gray-400 mt-6">
            <Link href="/login" className="text-rose-600 hover:underline">Log in</Link> to track your orders.
          </p>
        )}
      </div>
    </>
  );
}
