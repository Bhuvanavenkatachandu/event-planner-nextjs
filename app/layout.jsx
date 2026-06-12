import './globals.scss';
import Script from 'next/script';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HashScrollHandler from '@/components/HashScrollHandler';

export const metadata = {
  title: 'Eventify — Plan, Discover & Book Amazing Events',
  description: 'The futuristic event booking platform. Discover concerts, workshops, conferences and more. Secure JWT auth, real-time seats, admin dashboard.',
  keywords: 'events, booking, concerts, workshops, conferences, Hyderabad',
  openGraph: {
    title: 'Eventify — Plan, Discover & Book Amazing Events',
    description: 'Discover and book amazing events near you.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head />
      <body>
        {/* Prevent dark-mode flash — runs before page renders */}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t){document.documentElement.setAttribute('data-theme',t);}else if(window.matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.setAttribute('data-theme','dark');}}catch(e){}})();`,
          }}
        />
        <Navbar />
        <HashScrollHandler />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
