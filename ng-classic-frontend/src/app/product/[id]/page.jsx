'use client';
import { useState } from 'react';
import { use } from 'react';
import useSWR from 'swr';
import Image from 'next/image';
import { fetchAPI, getStrapiMedia } from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { getCategoryLabel } from '@/lib/categories';
import ReviewList from '@/components/ReviewList';

export default function ProductPage({ params }) {
  const { id } = use(params);
  const { data, isLoading } = useSWR(
    `/products/${id}?populate=images,reviews.user`,
    fetchAPI
  );
  const [imgIndex, setImgIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore(s => s.addItem);

  if (isLoading) return <div className="max-w-4xl mx-auto p-12 text-center text-gray-400">Loading...</div>;
  if (!data?.data) return <div className="max-w-4xl mx-auto p-12 text-center text-gray-400">Product not found.</div>;

  const product = data.data;
  const attrs = product.attributes ?? product;
  const images = attrs.images?.data ?? [];
  const mainImg = images[imgIndex];
  const imgUrl = mainImg ? getStrapiMedia(mainImg.attributes?.url ?? mainImg.url) : null;

  function handleAddToCart() {
    for (let i = 0; i < qty; i++) {
      addItem({ id: product.id, name: attrs.name, price: attrs.price, image: imgUrl });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const waText = encodeURIComponent(`Hi, I'd like to order: ${attrs.name} x${qty}`);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="rounded-2xl overflow-hidden bg-rose-50 aspect-square relative mb-3">
            {imgUrl ? (
              <Image src={imgUrl} alt={attrs.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">No image</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {images.map((img, i) => {
                const thumbUrl = getStrapiMedia(img.attributes?.url ?? img.url);
                return (
                  <button
                    key={i}
                    onClick={() => setImgIndex(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      i === imgIndex ? 'border-rose-500' : 'border-transparent'
                    }`}
                  >
                    <Image src={thumbUrl} alt="" width={64} height={64} className="object-cover w-full h-full" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <span className="text-xs text-rose-500 font-medium tracking-widest uppercase">
            {getCategoryLabel(attrs.category)}
          </span>
          <h1 className="font-playfair text-3xl text-rose-900 mt-2 mb-4">{attrs.name}</h1>
          <p className="text-2xl font-semibold text-rose-700 mb-4">
            ₦{Number(attrs.price).toLocaleString()}
          </p>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">{attrs.description}</p>

          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setQty(q => Math.max(1, q - 1))}
              className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-lg">−</button>
            <span className="w-8 text-center font-medium">{qty}</span>
            <button onClick={() => setQty(q => q + 1)}
              className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-lg">+</button>
            <span className="text-sm text-gray-400 ml-2">{attrs.stock} in stock</span>
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
