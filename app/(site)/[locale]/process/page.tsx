import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { locales } from '@/i18n/routing'
import { ProcessView } from '@/components/process-view'
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
    ? "Nuestro Proceso — 9 Etapas de Manufactura Artesanal | Lyon's Artisans"
    : "Our Process — 9 Essential Stages of Handcrafted Footwear | Lyon's Artisans"

  const description = isSpanish
    ? "Desde la primera selección de pieles hasta la entrega internacional: conoce las 9 etapas donde la destreza artesanal y la ingeniería moderna se unen en León, México."
    : "From raw material selection to international distribution: discover the 9 stages where human craftsmanship meets modern engineering in León, México."

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${locale}/process`,
      languages: {
        en: `${baseUrl}/en/process`,
        es: `${baseUrl}/es/process`,
        'x-default': `${baseUrl}/en/process`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/process`,
      siteName: "Lyon's Artisans",
      locale: isSpanish ? 'es_MX' : 'en_US',
      type: 'website',
      images: [
        {
          url: '/images/process-1.png',
          width: 1200,
          height: 630,
          alt: "Lyon's Artisans Manufacturing Process",
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/process-1.png'],
    },
  }
}

export default async function ProcessPage({ params }: PageProps) {
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
        name: isSpanish ? 'Nuestro Proceso' : 'Our Process',
        item: `${baseUrl}/${locale}/process`,
      },
    ],
  }

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: isSpanish
      ? 'Proceso de Manufactura de Calzado y Artículos de Piel'
      : 'Handcrafted Footwear & Leather Goods Manufacturing Process',
    description: isSpanish
      ? 'Nueve etapas esenciales donde la tradición artesanal se encuentra con la innovación y precisión técnica.'
      : 'Nine essential stages where bespoke shoemaking traditions meet modern technical precision.',
    totalTime: 'P14D',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: isSpanish ? 'Selección y Evaluación de Materiales' : 'Material Selection & Evaluation',
        text: isSpanish
          ? 'Selección rigurosa de pieles y componentes premium.'
          : 'Careful selection and evaluation of premium leathers and components.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: isSpanish ? 'Desarrollo de Producto e Ingeniería' : 'Product Development & Engineering',
        text: isSpanish
          ? 'Diseño para el confort, la eficiencia y la precisión.'
          : 'Designing for comfort, efficiency, and engineering precision.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: isSpanish ? 'Patronaje y Optimización Digital' : 'Pattern Making & Digital Optimization',
        text: isSpanish
          ? 'Patronaje digital para precisión y sustentabilidad.'
          : 'Digital pattern-making to optimize leather consumption and consistency.',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: isSpanish ? 'Proceso de Corte' : 'Cutting Process',
        text: isSpanish
          ? 'Tecnología de corte Teseo con supervisión artesanal.'
          : 'Advanced Teseo cutting technology supervised by experienced craftsmen.',
      },
      {
        '@type': 'HowToStep',
        position: 5,
        name: isSpanish ? 'Costura y Construcción del Corte' : 'Stitching & Upper Construction',
        text: isSpanish
          ? 'Destreza artesanal en cada costura y unión.'
          : 'Artisan upper assembly with precision developed over decades.',
      },
      {
        '@type': 'HowToStep',
        position: 6,
        name: isSpanish ? 'Montado y Ensamblaje' : 'Lasting & Assembly',
        text: isSpanish
          ? 'Técnicas tradicionales de montado a mano para un ajuste superior.'
          : 'Traditional handcrafted lasting techniques for superior shape and comfort.',
      },
      {
        '@type': 'HowToStep',
        position: 7,
        name: isSpanish ? 'Acabado y Detallado a Mano' : 'Finishing & Hand Detailing',
        text: isSpanish
          ? 'Pulido, refinación y acabado individual por pieza.'
          : 'Inspection, cleaning, polishing, and hand detailing before final approval.',
      },
      {
        '@type': 'HowToStep',
        position: 8,
        name: isSpanish ? 'Control de Calidad' : 'Quality Control',
        text: isSpanish
          ? 'Múltiples filtros de inspección a lo largo del proceso.'
          : 'Pair-by-pair inspection ensuring international export standards.',
      },
      {
        '@type': 'HowToStep',
        position: 9,
        name: isSpanish ? 'Empaque y Logística Internacional' : 'Packaging & International Logistics',
        text: isSpanish
          ? 'Procedimientos de exportación y distribución global eficiente.'
          : 'Organized export procedures and worldwide delivery standards.',
      },
    ],
  }

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={howToSchema} />
      <ProcessView />
    </>
  )
}
