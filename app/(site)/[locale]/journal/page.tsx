import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { sanityFetch } from '@/sanity/lib/client'
import {
  JOURNAL_PAGE_QUERY,
  CATEGORIES_QUERY,
  POSTS_QUERY,
} from '@/sanity/lib/queries'
import type {
  JOURNAL_PAGE_QUERY_RESULT,
  CATEGORIES_QUERY_RESULT,
  POSTS_QUERY_RESULT,
} from '@/sanity.types'
import { JournalListView } from '@/components/journal-list-view'
import { urlForImage } from '@/sanity/lib/image'
import { locales } from '@/i18n/routing'

interface PageProps {
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lyonsartisans.mx'

  try {
    const journalPage = await sanityFetch<typeof JOURNAL_PAGE_QUERY>({
      query: JOURNAL_PAGE_QUERY,
      params: { locale },
      tags: ['journalPage', `journalPage:${locale}`],
    })

    const title =
      journalPage?.seo?.title ||
      `${journalPage?.eyebrow || (locale === 'es' ? 'Diario' : 'Journal')} | Lyon's Artisans`
    const description =
      journalPage?.seo?.description ||
      journalPage?.heading ||
      (locale === 'es'
        ? "Explora historias, herencia artesanal y eventos de Lyon's Artisans."
        : "Explore stories, craftsmanship heritage, and events from Lyon's Artisans.")

    const ogImageUrl = journalPage?.seo?.ogImage
      ? urlForImage(journalPage.seo.ogImage as any).width(1200).height(630).url()
      : undefined

    return {
      title,
      description,
      alternates: {
        canonical: `${baseUrl}/${locale}/journal`,
        languages: {
          en: `${baseUrl}/en/journal`,
          es: `${baseUrl}/es/journal`,
          'x-default': `${baseUrl}/en/journal`,
        },
      },
      openGraph: {
        title,
        description,
        url: `${baseUrl}/${locale}/journal`,
        ...(ogImageUrl ? { images: [{ url: ogImageUrl, width: 1200, height: 630 }] } : {}),
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        ...(ogImageUrl ? { images: [ogImageUrl] } : {}),
      },
    }
  } catch {
    return {
      title: locale === 'es' ? "Diario | Lyon's Artisans" : "Journal | Lyon's Artisans",
      description:
        locale === 'es'
          ? "Historias, herencia y eventos de Lyon's Artisans."
          : "Stories, heritage, and events from Lyon's Artisans.",
    }
  }
}

import { JsonLd } from '@/components/json-ld'

export default async function JournalPage({ params }: PageProps) {
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
        name: isSpanish ? 'Diario' : 'Journal',
        item: `${baseUrl}/${locale}/journal`,
      },
    ],
  }

  const [journalPage, categories, posts] = await Promise.all([
    sanityFetch<typeof JOURNAL_PAGE_QUERY>({
      query: JOURNAL_PAGE_QUERY,
      params: { locale },
      tags: ['journalPage', `journalPage:${locale}`],
    }).catch(() => null as JOURNAL_PAGE_QUERY_RESULT),
    sanityFetch<typeof CATEGORIES_QUERY>({
      query: CATEGORIES_QUERY,
      params: { locale },
      tags: ['category', `category:${locale}`],
    }).catch(() => [] as CATEGORIES_QUERY_RESULT),
    sanityFetch<typeof POSTS_QUERY>({
      query: POSTS_QUERY,
      params: { locale },
      tags: ['post', `post:${locale}`],
    }).catch(() => [] as POSTS_QUERY_RESULT),
  ])

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JournalListView
        eyebrow={journalPage?.eyebrow}
        heading={journalPage?.heading}
        categories={categories || []}
        posts={posts || []}
      />
    </>
  )
}
