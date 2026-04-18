'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import AdminProductForm from '@/components/AdminProductForm';
import AdminOrderTable from '@/components/AdminOrderTable';

const TABS = ['Orders', 'Products'];

export default function AdminPage() {
  const router = useRouter();
  const { user, ready } = useAuthStore();
  const [tab, setTab] = useState('Orders');

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role !== 'admin') {
      router.push('/account');
    }
  }, [ready, router, user]);

  if (!ready || !user || user.role !== 'admin') return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="font-playfair text-3xl text-heading mb-8">Admin Dashboard</h1>

      <div className="flex gap-3 mb-8">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-full text-sm border transition-all ${
              tab === t ? 'bg-rose-700 text-white border-rose-700' : 'border-border-default text-heading-strong hover:bg-surface-soft'
            }`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Orders' && <AdminOrderTable />}
      {tab === 'Products' && <AdminProductForm />}
    </div>
  );
}
