'use client';
import { useEffect, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

const THEME_KEY = 'ng-classic-theme';

function subscribe() {
  return () => {};
}

export default function Navbar() {
  const count = useCartStore(s => s.count());
  const user = useAuthStore(s => s.user);
  const ready = useAuthStore(s => s.ready);
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    if (!mounted) {
      return undefined;
    }

    const getTheme = () => {
      const saved = window.localStorage.getItem(THEME_KEY);
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const applyTheme = (nextTheme) => {
      document.documentElement.dataset.theme = nextTheme;
      document.documentElement.style.colorScheme = nextTheme;
      setTheme(nextTheme);
    };

    applyTheme(getTheme());

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemTheme = () => {
      if (!window.localStorage.getItem(THEME_KEY)) {
        applyTheme(media.matches ? 'dark' : 'light');
      }
    };

    media.addEventListener?.('change', handleSystemTheme);
    return () => media.removeEventListener?.('change', handleSystemTheme);
  }, [mounted]);

  function toggleTheme() {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    window.localStorage.setItem(THEME_KEY, nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    setTheme(nextTheme);
  }

  return (
    <nav className="site-nav sticky top-0 z-50 border-b">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-playfair text-xl text-rose-800 font-semibold tracking-wide">
          NG Classic
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
          <Link href="/shop" className="hover:text-rose-700 transition-colors">Shop</Link>
          {mounted && user?.role === 'admin' && (
            <Link href="/admin" className="hover:text-rose-700 transition-colors">Admin</Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={toggleTheme}
            className="theme-switch"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2.5M12 19.5V22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07 6.7 17.3M17.3 6.7l1.77-1.77" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
              </svg>
            )}
          </button>
          {mounted && ready && user ? (
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
            {mounted && count > 0 && (
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
