'use client';
import { useState } from 'react';
import useSWR from 'swr';
import { listProducts } from '@/lib/api';
import { CATEGORIES } from '@/lib/categories';
import ProductCard from '@/components/ProductCard';

export default function ShopPage() {
  const [cat, setCat] = useState('');
  const { data, isLoading } = useSWR(['products', cat], ([, category]) => listProducts({ category }));
  const products = data ?? [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-playfair text-4xl text-rose-900 mb-4">Shop</h1>
      <p className="text-gray-500 mb-8">
        {products.length} product{products.length !== 1 ? 's' : ''} available
      </p>

      {/* Category filter */}
      <div className="flex gap-3 flex-wrap mb-10">
        <button
          onClick={() => setCat('')}
          className={`px-5 py-2 rounded-full text-sm border transition-all ${
            cat === '' ? 'bg-rose-700 text-white border-rose-700' : 'border-rose-300 text-rose-700 hover:bg-rose-50'
          }`}
        >
          All
        </button>
        {CATEGORIES.map(c => (
          <button
            key={c.value}
            onClick={() => setCat(c.value)}
            className={`px-5 py-2 rounded-full text-sm border transition-all ${
              cat === c.value
                ? 'bg-rose-700 text-white border-rose-700'
                : 'border-rose-300 text-rose-700 hover:bg-rose-50'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-gray-100 animate-pulse h-72" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-400 py-20">No products in this category yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
