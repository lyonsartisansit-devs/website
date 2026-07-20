import { Analytics } from '@vercel/analytics/next';
import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Tenor_Sans, Montserrat } from 'next/font/google';
import { LanguageProvider } from '@/components/language-provider';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Loader } from '@/components/loader';
import './globals.css';

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
});

const tenor = Tenor_Sans({
  weight: '400',
  variable: '--font-tenor',
  subsets: ['latin'],
});

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "Lyon's Artisans — Premium Footwear & Leather Goods | León, México",
  description:
    "Founded in León, México, Lyon's Artisans crafts premium footwear and leather goods — refined craftsmanship with international-level execution.",
  generator: 'Blackchery it consulting',
};

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f3efe7',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${tenor.variable} ${montserrat.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <Loader />
        <LanguageProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </LanguageProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  );
}
