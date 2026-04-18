'use client';
import { useState } from 'react';
import useSWR from 'swr';
import { deleteProduct, getProductImageUrl, listProducts, saveProduct } from '@/lib/api';
import { CATEGORIES } from '@/lib/categories';
import Image from 'next/image';

const EMPTY = { name: '', category: 'Wigs', price: '', stock: '', description: '', imageUrls: '' };

function serializeImageUrls(imageUrls) {
  return (imageUrls ?? []).join(', ');
}

function parseImageUrls(value) {
  return value
    .split(',')
    .map(url => url.trim())
    .filter(Boolean);
}

export default function AdminProductForm() {
  const { data, mutate } = useSWR(['admin-products'], () => listProducts());
  const products = data ?? [];

  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  function startEdit(product) {
    setEditing(product.id);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      description: product.description ?? '',
      imageUrls: serializeImageUrls(product.image_urls),
    });
  }

  function reset() {
    setForm(EMPTY);
    setEditing(null);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await saveProduct({
        id: editing,
        ...form,
        image_urls: parseImageUrls(form.imageUrls),
      });
      setSuccess(editing ? 'Product updated.' : 'Product created.');
      reset();
      mutate();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      alert(error.message || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this product?')) return;
    await deleteProduct(id);
    mutate();
  }

  return (
    <div className="space-y-10">
      {/* Form */}
      <div className="border border-border-subtle rounded-2xl p-6 bg-surface-soft">
        <h2 className="font-medium text-heading mb-5">{editing ? 'Edit Product' : 'Add New Product'}</h2>
        {success && <p className="text-green-600 dark:text-green-400 text-sm mb-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-3">✓ {success}</p>}
        <form onSubmit={handleSave} className="space-y-4">
          <input className="input-field" placeholder="Product name" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} required />
          <select className="input-field" value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}>
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-4">
            <input className="input-field" type="number" placeholder="Price (₦)" value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })} required min="0" />
            <input className="input-field" type="number" placeholder="Stock qty" value={form.stock}
              onChange={e => setForm({ ...form, stock: e.target.value })} required min="0" />
          </div>
          <textarea className="input-field resize-none" rows={3} placeholder="Description"
            value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <textarea
            className="input-field resize-none"
            rows={3}
            placeholder="Image URLs, separated by commas"
            value={form.imageUrls}
            onChange={e => setForm({ ...form, imageUrls: e.target.value })}
          />
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editing ? 'Update Product' : 'Add Product'}
            </button>
            {editing && (
              <button type="button" onClick={reset} className="btn-outline">Cancel</button>
            )}
          </div>
        </form>
        <p className="text-xs text-muted mt-4">
          Supabase products use an `image_urls` text array. Paste one or more public image URLs separated by commas.
        </p>
      </div>

      {/* Product list */}
      <div>
        <h2 className="font-medium text-heading mb-4">All Products ({products.length})</h2>
        <div className="space-y-3">
          {products.map(product => {
            const imgUrl = getProductImageUrl(product.image_urls?.[0]);
            return (
              <div key={product.id} className="flex items-center gap-4 border border-border-subtle rounded-xl p-4">
                <div className="w-14 h-14 rounded-lg bg-surface-soft overflow-hidden relative flex-shrink-0">
                  {imgUrl
                    ? <Image src={imgUrl} alt={product.name} fill className="object-cover" unoptimized />
                    : <div className="w-full h-full bg-surface-strong" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-primary truncate">{product.name}</p>
                  <p className="text-xs text-muted">₦{Number(product.price).toLocaleString()} · Stock: {product.stock}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(product)}
                    className="text-xs px-3 py-1.5 border border-border-default text-heading-strong rounded-lg hover:bg-surface-soft transition-colors">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(product.id)}
                    className="text-xs px-3 py-1.5 border border-red-200 dark:border-red-900 text-red-500 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
