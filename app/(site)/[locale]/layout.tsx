import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Tenor_Sans, Montserrat } from 'next/font/google'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { routing, locales, type Locale } from '@/i18n/routing'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Loader } from '@/components/loader'
import { TranslationsProvider } from '@/components/translations-provider'
import '@/app/globals.css'

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
})

const tenor = Tenor_Sans({
  weight: '400',
  variable: '--font-tenor',
  subsets: ['latin'],
})

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
})

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

import { JsonLd } from '@/components/json-ld'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lyonsartisans.mx'
  const isSpanish = locale === 'es'

  const title = isSpanish
    ? "Lyon's Artisans — Calzado y Artículos de Piel Premium | León, México"
    : "Lyon's Artisans — Premium Footwear & Leather Goods | León, México"

  const description = isSpanish
    ? "Fundada en León, México, Lyon's Artisans elabora calzado y artículos de piel premium — artesanía refinada con ejecución internacional."
    : "Founded in León, México, Lyon's Artisans crafts premium footwear and leather goods — refined craftsmanship with international-level execution."

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    generator: 'Blackchery it consulting',
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        en: `${baseUrl}/en`,
        es: `${baseUrl}/es`,
        'x-default': `${baseUrl}/en`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}`,
      siteName: "Lyon's Artisans",
      locale: isSpanish ? 'es_MX' : 'en_US',
      type: 'website',
      images: [
        {
          url: '/images/hero.png',
          width: 1200,
          height: 630,
          alt: "Lyon's Artisans León México",
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/hero.png'],
    },
  }
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f3efe7',
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as Locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lyonsartisans.mx'

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'ShoeStore'],
    name: "Lyon's Artisans",
    url: baseUrl,
    logo: `${baseUrl}/logo-STONE.svg`,
    image: `${baseUrl}/images/hero.png`,
    description:
      locale === 'es'
        ? "Fundada en León, México, Lyon's Artisans elabora calzado y artículos de piel premium — artesanía refinada con ejecución internacional."
        : "Founded in León, México, Lyon's Artisans crafts premium footwear and leather goods — refined craftsmanship with international-level execution.",
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'León',
      addressRegion: 'Guanajuato',
      addressCountry: 'MX',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'hello@lyonsartisans.mx',
      contactType: 'customer service',
    },
    sameAs: ['https://www.instagram.com/lyonsartisans/'],
  }

  const skipLabel = locale === 'es' ? 'Saltar al contenido principal' : 'Skip to main content'

  return (
    <html
      lang={locale}
      className={`${playfair.variable} ${tenor.variable} ${montserrat.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <JsonLd data={organizationSchema} />
        <a href="#main-content" className="skip-to-content">
          {skipLabel}
        </a>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <TranslationsProvider>
            <Loader />
            <SiteHeader />
            <main id="main-content">{children}</main>
            <SiteFooter />
          </TranslationsProvider>
        </NextIntlClientProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
