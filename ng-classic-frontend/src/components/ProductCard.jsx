import Link from 'next/link';
import Image from 'next/image';
import { getStrapiMedia, getCategoryLabel } from '@/lib/api';
import { getCategoryLabel as getCatLabel } from '@/lib/categories';

export default function ProductCard({ product }) {
  const attrs = product.attributes ?? product;
  const images = attrs.images?.data ?? [];
  const imgUrl = images[0]
    ? getStrapiMedia(images[0].attributes?.url ?? images[0].url)
    : null;

  return (
    <Link href={`/product/${product.id}`} className="card group block">
      <div className="aspect-square relative bg-rose-50 overflow-hidden">
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={attrs.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-rose-200">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
        )}
        {attrs.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-500 border border-gray-300 px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-rose-400 mb-1">{getCatLabel(attrs.category)}</p>
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">{attrs.name}</h3>
        <p className="text-rose-700 font-semibold">₦{Number(attrs.price).toLocaleString()}</p>
      </div>
    </Link>
  );
}
