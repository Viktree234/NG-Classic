'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';

export default function CartPage() {
  const { items, removeItem, updateQty, total } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="font-playfair text-3xl text-heading mb-4">Your Cart</h1>
        <p className="text-muted mb-8">Your cart is empty.</p>
        <Link href="/shop" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-playfair text-3xl text-heading mb-8">Your Cart</h1>

      <div className="divide-y divide-border-subtle">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-4 py-5">
            <div className="w-20 h-20 rounded-xl bg-surface-soft overflow-hidden relative flex-shrink-0">
              {item.image ? (
                <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
              ) : (
                <div className="w-full h-full bg-surface-strong" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-primary">{item.name}</p>
              <p className="text-heading-strong text-sm">₦{Number(item.price).toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQty(item.id, item.qty - 1)}
                className="w-8 h-8 rounded-full border border-border-default hover:bg-surface-soft flex items-center justify-center">−</button>
              <span className="w-6 text-center text-sm">{item.qty}</span>
              <button onClick={() => updateQty(item.id, item.qty + 1)}
                className="w-8 h-8 rounded-full border border-border-default hover:bg-surface-soft flex items-center justify-center">+</button>
            </div>
            <p className="text-primary font-medium w-28 text-right">
              ₦{(item.price * item.qty).toLocaleString()}
            </p>
            <button onClick={() => removeItem(item.id)}
              className="text-muted hover:text-red-400 transition-colors ml-2 text-lg">✕</button>
          </div>
        ))}
      </div>

      <div className="border-t border-border-default pt-6 mt-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-secondary">Total</p>
          <p className="font-playfair text-2xl text-heading">₦{total().toLocaleString()}</p>
        </div>
        <Link href="/checkout" className="btn-primary">Proceed to Checkout</Link>
      </div>
    </div>
  );
}
