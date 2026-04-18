import './globals.css';
import Script from 'next/script';
import ClientShell from '@/components/ClientShell';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'NG Classic — Premium Hair Collection',
  description: 'Shop the finest wigs, bundles, closures and hair care products.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans min-h-screen flex flex-col">
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (() => {
              try {
                const key = 'ng-classic-theme';
                const saved = window.localStorage.getItem(key);
                const theme = saved === 'dark' ? 'dark' : 'light';
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
                document.documentElement.style.colorScheme = theme;
              } catch (_) {}
            })();
          `}
        </Script>
        <ClientShell />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
