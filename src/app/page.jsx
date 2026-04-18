'use client';
import Link from 'next/link';
import useSWR from 'swr';
import { listProducts } from '@/lib/api';
import ProductCard from '@/components/ProductCard';

export default function HomePage() {
  const { data } = useSWR(['products', 'featured'], () => listProducts({ limit: 4 }));
  const products = data ?? [];

  return (
    <>
      {/* Hero */}
      <section className="hero-gradient py-24 px-6 text-center">
        <p className="text-heading-strong text-sm font-medium tracking-widest uppercase mb-3">
          Premium Hair Collection
        </p>
        <h1 className="font-playfair text-5xl md:text-6xl text-heading mb-6 leading-tight">
          Luxury Hair,<br />
          <span className="text-heading-strong">Your Way</span>
        </h1>
        <p className="text-secondary text-lg max-w-xl mx-auto mb-10">
          Discover our curated collection of wigs, bundles, closures and hair care essentials.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/shop" className="btn-primary">Shop Now</Link>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="btn-whatsapp"
          >
            Chat on WhatsApp
          </a>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="font-playfair text-3xl text-center text-heading mb-12">
          Featured Products
        </h2>
        {products.length === 0 ? (
          <p className="text-center text-muted">No products yet. Check back soon!</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
        <div className="text-center mt-12">
          <Link href="/shop" className="btn-outline">View All Products</Link>
        </div>
      </section>

      {/* Why Us */}
      <section className="bg-surface-soft py-16 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { icon: '✦', title: 'Premium Quality', desc: 'Only the finest human hair sourced ethically.' },
            { icon: '✦', title: 'Fast Delivery', desc: 'Nationwide delivery across Nigeria.' },
            { icon: '✦', title: 'Easy Returns', desc: '7-day hassle-free return policy.' },
          ].map(item => (
            <div key={item.title} className="p-6">
              <div className="text-heading-strong text-2xl mb-3">{item.icon}</div>
              <h3 className="font-playfair text-lg text-heading mb-2">{item.title}</h3>
              <p className="text-secondary text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
