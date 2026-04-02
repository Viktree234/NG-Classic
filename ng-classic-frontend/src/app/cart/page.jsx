'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';

export default function CartPage() {
  const { items, removeItem, updateQty, total } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="font-playfair text-3xl text-rose-900 mb-4">Your Cart</h1>
        <p className="text-gray-400 mb-8">Your cart is empty.</p>
        <Link href="/shop" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-playfair text-3xl text-rose-900 mb-8">Your Cart</h1>

      <div className="divide-y divide-gray-100">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-4 py-5">
            <div className="w-20 h-20 rounded-xl bg-rose-50 overflow-hidden relative flex-shrink-0">
              {item.image ? (
                <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
              ) : (
                <div className="w-full h-full bg-rose-100" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{item.name}</p>
              <p className="text-rose-600 text-sm">₦{Number(item.price).toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQty(item.id, item.qty - 1)}
                className="w-8 h-8 rounded-full border border-gray-200 hover:bg-gray-50 flex items-center justify-center">−</button>
              <span className="w-6 text-center text-sm">{item.qty}</span>
              <button onClick={() => updateQty(item.id, item.qty + 1)}
                className="w-8 h-8 rounded-full border border-gray-200 hover:bg-gray-50 flex items-center justify-center">+</button>
            </div>
            <p className="text-gray-800 font-medium w-28 text-right">
              ₦{(item.price * item.qty).toLocaleString()}
            </p>
            <button onClick={() => removeItem(item.id)}
              className="text-gray-300 hover:text-red-400 transition-colors ml-2 text-lg">✕</button>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-6 mt-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Total</p>
          <p className="font-playfair text-2xl text-rose-900">₦{total().toLocaleString()}</p>
        </div>
        <Link href="/checkout" className="btn-primary">Proceed to Checkout</Link>
      </div>
    </div>
  );
}
