import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { locales } from '@/i18n/routing'
import { UnderConstruction } from '@/components/under-construction'

interface PageProps {
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lyonsartisans.mx'
  const isSpanish = locale === 'es'

  const title = isSpanish
    ? "Próximamente — Lyon's Artisans | León, México"
    : "Coming Soon — Lyon's Artisans | León, México"

  const description = isSpanish
    ? "Un nuevo hogar toma forma. Calzado y artículos de piel premium, hechos a mano en una de las grandes capitales zapateras del mundo."
    : "A new standard. Premium footwear and leather goods, made by hand in one of the world's great shoemaking capitals."

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${locale}/coming-soon`,
      languages: {
        en: `${baseUrl}/en/coming-soon`,
        es: `${baseUrl}/es/coming-soon`,
        'x-default': `${baseUrl}/en/coming-soon`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/coming-soon`,
      siteName: "Lyon's Artisans",
      locale: isSpanish ? 'es_MX' : 'en_US',
      type: 'website',
      images: [
        {
          url: '/images/hero.png',
          width: 1200,
          height: 630,
          alt: "Lyon's Artisans Coming Soon",
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

export default async function ComingSoonPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return <UnderConstruction />
}
