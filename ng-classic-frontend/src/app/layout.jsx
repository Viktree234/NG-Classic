import './globals.css';
import ClientShell from '@/components/ClientShell';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'NG Classic — Premium Hair Collection',
  description: 'Shop the finest wigs, bundles, closures and hair care products.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="font-sans bg-white text-gray-900 min-h-screen flex flex-col">
        <ClientShell />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
