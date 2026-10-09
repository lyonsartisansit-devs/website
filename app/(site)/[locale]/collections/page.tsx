import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { locales } from '@/i18n/routing'
import { CollectionsView } from '@/components/collections-view'
import { JsonLd } from '@/components/json-ld'

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
    ? "Colecciones — Calzado y Artículos de Piel Hechos para Perdurar | Lyon's Artisans"
    : "Collections — Footwear & Leather Goods Made to Endure | Lyon's Artisans"

  const description = isSpanish
    ? "Explora nuestras categorías de manufactura: Derby, Mocasines, Sneakers minimalistas, Botas y Marroquinería de alta gama con acabados artesanales."
    : "Explore our manufacturing capabilities: Dress shoes, Loafers, Minimal Sneakers, Handcrafted Boots, and Bespoke Leather Goods."

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${locale}/collections`,
      languages: {
        en: `${baseUrl}/en/collections`,
        es: `${baseUrl}/es/collections`,
        'x-default': `${baseUrl}/en/collections`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/collections`,
      siteName: "Lyon's Artisans",
      locale: isSpanish ? 'es_MX' : 'en_US',
      type: 'website',
      images: [
        {
          url: '/images/collection-dress.png',
          width: 1200,
          height: 630,
          alt: "Lyon's Artisans Collections",
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/collection-dress.png'],
    },
  }
}

export default async function CollectionsPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lyonsartisans.mx'
  const isSpanish = locale === 'es'

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: isSpanish ? 'Inicio' : 'Home',
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: isSpanish ? 'Colecciones' : 'Collections',
        item: `${baseUrl}/${locale}/collections`,
      },
    ],
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <CollectionsView />
    </>
  )
}
