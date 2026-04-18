import Link from 'next/link';

const CURRENT_YEAR = 2026;

export default function Footer() {
  const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  return (
    <footer className="site-footer py-12 px-4 mt-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-playfair text-xl footer-heading mb-3">NG Classic</h3>
          <p className="text-sm footer-muted leading-relaxed">
            Premium hair products delivered across Nigeria. Quality you can feel.
          </p>
        </div>
        <div>
          <h4 className="font-medium footer-heading mb-3 text-sm uppercase tracking-wider">Shop</h4>
          <ul className="space-y-2 text-sm footer-muted">
            <li><Link href="/shop" className="footer-link hover:opacity-100 transition-opacity">All Products</Link></li>
            <li><Link href="/shop?cat=Wigs" className="footer-link hover:opacity-100 transition-opacity">Wigs</Link></li>
            <li><Link href="/shop?cat=Bundles" className="footer-link hover:opacity-100 transition-opacity">Bundles</Link></li>
            <li><Link href="/shop?cat=Closures_Frontals" className="footer-link hover:opacity-100 transition-opacity">Closures & Frontals</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium footer-heading mb-3 text-sm uppercase tracking-wider">Contact</h4>
          <ul className="space-y-2 text-sm footer-muted">
            <li>
              <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer"
                className="footer-link hover:opacity-100 transition-opacity">
                WhatsApp Us
              </a>
            </li>
            <li><Link href="/account" className="footer-link hover:opacity-100 transition-opacity">My Orders</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t footer-border text-center text-xs footer-muted opacity-70">
        © {CURRENT_YEAR} NG Classic. All rights reserved.
      </div>
    </footer>
  );
}
