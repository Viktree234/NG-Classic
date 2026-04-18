import Link from 'next/link';
import Image from 'next/image';
import { getProductImageUrl } from '@/lib/api';
import { getCategoryLabel as getCatLabel } from '@/lib/categories';

export default function ProductCard({ product }) {
  const imgUrl = getProductImageUrl(product.image_urls?.[0]);

  return (
    <Link href={`/product/${product.id}`} className="card group block">
      <div className="aspect-square relative bg-surface-soft overflow-hidden">
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-heading-strong opacity-30">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-surface-overlay flex items-center justify-center">
            <span className="text-xs font-medium text-secondary border border-border-default px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-heading-strong mb-1">{getCatLabel(product.category)}</p>
        <h3 className="text-sm font-medium text-primary line-clamp-2 mb-2">{product.name}</h3>
        <p className="text-heading-strong font-semibold">₦{Number(product.price).toLocaleString()}</p>
      </div>
    </Link>
  );
}
