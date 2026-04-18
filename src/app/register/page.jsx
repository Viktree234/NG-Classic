'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore(s => s.register);
  const user = useAuthStore(s => s.user);
  const ready = useAuthStore(s => s.ready);
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ready && user) {
      router.push('/account');
    }
  }, [ready, router, user]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await register(form.username, form.email, form.password);
      router.push('/account');
    } catch (error) {
      setError(error.message || 'Registration failed. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="font-playfair text-3xl text-heading text-center mb-2">Create Account</h1>
        <p className="text-secondary text-center text-sm mb-8">Join NG Classic today</p>

        {error && (
          <div className="bg-surface-soft border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="input-field" placeholder="Username" value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })} required />
          <input className="input-field" type="email" placeholder="Email address" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} required />
          <input className="input-field" type="password" placeholder="Password" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })} required />
          <input className="input-field" type="password" placeholder="Confirm password" value={form.confirm}
            onChange={e => setForm({ ...form, confirm: e.target.value })} required />
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-secondary mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-heading-strong hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
