import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { locales } from '@/i18n/routing'
import { WhoWeAreView } from '@/components/who-we-are-view'
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
    ? "Quiénes Somos — Herencia Artesanal en León, México | Lyon's Artisans"
    : "Who We Are — Heritage, Craftsmanship & Global Standards | Lyon's Artisans"

  const description = isSpanish
    ? "Fundada en León, México, Lyon's Artisans une la tradición zapatera artesanal con tecnología moderna y estándares internacionales de calidad y responsabilidad social."
    : "Founded in León, México, Lyon's Artisans unites traditional shoemaking heritage with modern engineering, high craftsmanship, and global production standards."

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${locale}/who-we-are`,
      languages: {
        en: `${baseUrl}/en/who-we-are`,
        es: `${baseUrl}/es/who-we-are`,
        'x-default': `${baseUrl}/en/who-we-are`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/who-we-are`,
      siteName: "Lyon's Artisans",
      locale: isSpanish ? 'es_MX' : 'en_US',
      type: 'website',
      images: [
        {
          url: '/images/about-hero.png',
          width: 1200,
          height: 630,
          alt: "Lyon's Artisans Atelier in León México",
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/about-hero.png'],
    },
  }
}

export default async function WhoWeArePage({ params }: PageProps) {
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
        name: isSpanish ? 'Quiénes Somos' : 'Who We Are',
        item: `${baseUrl}/${locale}/who-we-are`,
      },
    ],
  }

  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: isSpanish ? 'Quiénes Somos — Lyon\'s Artisans' : 'Who We Are — Lyon\'s Artisans',
    description: isSpanish
      ? 'Herencia, artesanía y experiencia global en manufactura de calzado en León, Guanajuato, México.'
      : 'Heritage, craftsmanship, and global experience in footwear manufacture in León, Guanajuato, Mexico.',
    mainEntity: {
      '@type': 'Organization',
      name: "Lyon's Artisans",
      url: baseUrl,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'León',
        addressRegion: 'Guanajuato',
        addressCountry: 'MX',
      },
    },
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={aboutSchema} />
      <WhoWeAreView />
    </>
  )
}
