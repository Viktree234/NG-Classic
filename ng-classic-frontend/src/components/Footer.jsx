import Link from 'next/link';

export default function Footer() {
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  return (
    <footer className="bg-rose-900 text-rose-100 py-12 px-4 mt-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-playfair text-xl text-white mb-3">NG Classic</h3>
          <p className="text-sm text-rose-300 leading-relaxed">
            Premium hair products delivered across Nigeria. Quality you can feel.
          </p>
        </div>
        <div>
          <h4 className="font-medium text-white mb-3 text-sm uppercase tracking-wider">Shop</h4>
          <ul className="space-y-2 text-sm text-rose-300">
            <li><Link href="/shop" className="hover:text-white transition-colors">All Products</Link></li>
            <li><Link href="/shop?cat=Wigs" className="hover:text-white transition-colors">Wigs</Link></li>
            <li><Link href="/shop?cat=Bundles" className="hover:text-white transition-colors">Bundles</Link></li>
            <li><Link href="/shop?cat=Closures_Frontals" className="hover:text-white transition-colors">Closures & Frontals</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-white mb-3 text-sm uppercase tracking-wider">Contact</h4>
          <ul className="space-y-2 text-sm text-rose-300">
            <li>
              <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer"
                className="hover:text-white transition-colors">
                WhatsApp Us
              </a>
            </li>
            <li><Link href="/account" className="hover:text-white transition-colors">My Orders</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-rose-800 text-center text-xs text-rose-400">
        © {new Date().getFullYear()} NG Classic. All rights reserved.
      </div>
    </footer>
  );
}
