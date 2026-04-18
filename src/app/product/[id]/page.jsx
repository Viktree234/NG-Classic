'use client';
import { useState } from 'react';
import { use } from 'react';
import useSWR from 'swr';
import Image from 'next/image';
import { getProduct, getProductImageUrl } from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { getCategoryLabel } from '@/lib/categories';
import ReviewList from '@/components/ReviewList';

export default function ProductPage({ params }) {
  const { id } = use(params);
  const { data: product, isLoading } = useSWR(id ? ['product', id] : null, ([, productId]) => getProduct(productId));
  const [imgIndex, setImgIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore(s => s.addItem);

  if (isLoading) return <div className="max-w-4xl mx-auto p-12 text-center text-muted">Loading...</div>;
  if (!product) return <div className="max-w-4xl mx-auto p-12 text-center text-muted">Product not found.</div>;

  const images = product.image_urls ?? [];
  const imgUrl = getProductImageUrl(images[imgIndex]);

  function handleAddToCart() {
    for (let i = 0; i < qty; i++) {
      addItem({ id: product.id, name: product.name, price: product.price, image: imgUrl });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const waText = encodeURIComponent(`Hi, I'd like to order: ${product.name} x${qty}`);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="rounded-2xl overflow-hidden bg-surface-soft aspect-square relative mb-3">
            {imgUrl ? (
              <Image src={imgUrl} alt={product.name} fill className="object-cover" unoptimized />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted">No image</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {images.map((thumbUrl, i) => {
                return (
                  <button
                    key={i}
                    onClick={() => setImgIndex(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      i === imgIndex ? 'border-heading-strong' : 'border-border-subtle'
                    }`}
                  >
                    <Image src={thumbUrl} alt="" width={64} height={64} className="object-cover w-full h-full" unoptimized />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <span className="text-xs text-heading-strong font-medium tracking-widest uppercase">
            {getCategoryLabel(product.category)}
          </span>
          <h1 className="font-playfair text-3xl text-heading mt-2 mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold text-heading-strong mb-4">
            ₦{Number(product.price).toLocaleString()}
          </p>
          <p className="text-secondary text-sm leading-relaxed mb-6">{product.description}</p>

          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setQty(q => Math.max(1, q - 1))}
              className="w-9 h-9 rounded-full border border-border-default flex items-center justify-center hover:bg-surface-soft text-lg">−</button>
            <span className="w-8 text-center font-medium">{qty}</span>
            <button onClick={() => setQty(q => q + 1)}
              className="w-9 h-9 rounded-full border border-border-default flex items-center justify-center hover:bg-surface-soft text-lg">+</button>
            <span className="text-sm text-muted ml-2">{product.stock} in stock</span>
          </div>

          <div className="flex flex-col gap-3">
            <button onClick={handleAddToCart} className="btn-primary">
              {added ? '✓ Added to Cart' : 'Add to Cart'}
            </button>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${waText}`}
              target="_blank" rel="noreferrer"
              className="btn-whatsapp text-center"
            >
              Order via WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16">
        <ReviewList productId={product.id} />
      </div>
    </div>
  );
}
