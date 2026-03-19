'use client';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

export default function Navbar() {
  const count = useCartStore(s => s.count());
  const user = useAuthStore(s => s.user);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-rose-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-playfair text-xl text-rose-800 font-semibold tracking-wide">
          NG Classic
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
          <Link href="/shop" className="hover:text-rose-700 transition-colors">Shop</Link>
          {user && (
            <Link href="/admin" className="hover:text-rose-700 transition-colors">Admin</Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <Link href="/account" className="text-sm text-gray-600 hover:text-rose-700 transition-colors">
              Account
            </Link>
          ) : (
            <Link href="/login" className="text-sm text-gray-600 hover:text-rose-700 transition-colors">
              Sign In
            </Link>
          )}
          <Link href="/cart" className="relative">
            <div className="w-9 h-9 rounded-full border border-rose-200 flex items-center justify-center hover:bg-rose-50 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-rose-700">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </div>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
