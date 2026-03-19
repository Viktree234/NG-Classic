'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { register } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export default function RegisterPage() {
  const router = useRouter();
  const loginStore = useAuthStore(s => s.login);
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const data = await register(form.username, form.email, form.password);
      loginStore(data.user, data.jwt);
      router.push('/account');
    } catch (err) {
      setError('Registration failed. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="font-playfair text-3xl text-rose-900 text-center mb-2">Create Account</h1>
        <p className="text-gray-400 text-center text-sm mb-8">Join NG Classic today</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 mb-4">
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

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-rose-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
