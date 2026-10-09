import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { locales } from '@/i18n/routing'
import { CraftsmanshipView } from '@/components/craftsmanship-view'
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
    ? "Artesanía y Personas — El Oficio Zapatero | Lyon's Artisans"
    : "Craftsmanship & People — Master Shoemaking | Lyon's Artisans"

  const description = isSpanish
    ? "Hecho por personas apasionadas por el oficio. Preservamos la zapatería tradicional creando oportunidades y desarrollo en León, Guanajuato."
    : "Built by people who care deeply about the craft. Discover how skilled artisans and master technicians assemble premium footwear in León, México."

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${locale}/craftsmanship`,
      languages: {
        en: `${baseUrl}/en/craftsmanship`,
        es: `${baseUrl}/es/craftsmanship`,
        'x-default': `${baseUrl}/en/craftsmanship`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/craftsmanship`,
      siteName: "Lyon's Artisans",
      locale: isSpanish ? 'es_MX' : 'en_US',
      type: 'website',
      images: [
        {
          url: '/images/craft-hero.png',
          width: 1200,
          height: 630,
          alt: "Lyon's Artisans Master Craftsmanship",
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/craft-hero.png'],
    },
  }
}

export default async function CraftsmanshipPage({ params }: PageProps) {
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
        name: isSpanish ? 'Artesanía' : 'Craftsmanship',
        item: `${baseUrl}/${locale}/craftsmanship`,
      },
    ],
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <CraftsmanshipView />
    </>
  )
}
