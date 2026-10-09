import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { locales } from '@/i18n/routing'
import { ContactView } from '@/components/contact-view'
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
    ? "Contacto — Inicia una Conversación de Manufactura | Lyon's Artisans"
    : "Contact — Start a Conversation with the House | Lyon's Artisans"

  const description = isSpanish
    ? "Colaboramos con marcas que buscan manufactura de calzado y artículos de piel premium con un toque humano. Contáctanos desde nuestro atelier en León, México."
    : "We partner with global brands seeking premium footwear and leather goods manufacturing with a human touch. Reach our team in León, México directly."

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${locale}/contact`,
      languages: {
        en: `${baseUrl}/en/contact`,
        es: `${baseUrl}/es/contact`,
        'x-default': `${baseUrl}/en/contact`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/contact`,
      siteName: "Lyon's Artisans",
      locale: isSpanish ? 'es_MX' : 'en_US',
      type: 'website',
      images: [
        {
          url: '/images/hero.png',
          width: 1200,
          height: 630,
          alt: "Contact Lyon's Artisans León México",
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

export default async function ContactPage({ params }: PageProps) {
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
        name: isSpanish ? 'Contacto' : 'Contact',
        item: `${baseUrl}/${locale}/contact`,
      },
    ],
  }

  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: isSpanish ? 'Contacto — Lyon\'s Artisans' : 'Contact — Lyon\'s Artisans',
    description: isSpanish
      ? 'Contacto directo con la casa de manufactura de Lyon\'s Artisans en León, Guanajuato, México.'
      : 'Direct contact with Lyon\'s Artisans manufacture house in León, Guanajuato, Mexico.',
    mainEntity: {
      '@type': 'Organization',
      name: "Lyon's Artisans",
      email: 'hello@lyonsartisans.mx',
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
      <JsonLd data={contactSchema} />
      <ContactView />
    </>
  )
}
