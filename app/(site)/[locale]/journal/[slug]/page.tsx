import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { sanityFetch } from '@/sanity/lib/client'
import {
  POST_BY_SLUG_QUERY,
  POST_SLUGS_BY_LOCALE_QUERY,
} from '@/sanity/lib/queries'
import { SanityImage } from '@/components/sanity-image'
import { MovingBanner } from '@/components/moving-banner'
import { JournalBlocks, type JournalBlockData } from '@/components/journal-blocks'
import { BackToTop } from '@/components/back-to-top'
import { SetPostTranslations } from '@/components/translations-provider'
import { urlForImage } from '@/sanity/lib/image'
import type { POST_BY_SLUG_QUERY_RESULT } from '@/sanity.types'

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  try {
    const slugs = await sanityFetch<typeof POST_SLUGS_BY_LOCALE_QUERY>({
      query: POST_SLUGS_BY_LOCALE_QUERY,
      tags: ['post'],
    })

    return (slugs || [])
      .filter((item) => Boolean(item.slug && item.language))
      .map((item) => ({
        locale: item.language!,
        slug: item.slug!,
      }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lyonsartisans.mx'

  const post = await sanityFetch<typeof POST_BY_SLUG_QUERY>({
    query: POST_BY_SLUG_QUERY,
    params: { locale, slug },
    tags: ['post', `post:${locale}:${slug}`],
  }).catch(() => null as POST_BY_SLUG_QUERY_RESULT)

  if (!post) {
    return {
      title:
        locale === 'es'
          ? "Historia No Encontrada | Lyon's Artisans"
          : "Story Not Found | Lyon's Artisans",
    }
  }

  const title = post.seo?.title || `${post.title} | Lyon's Artisans Journal`
  const description = post.seo?.description || post.excerpt
  const ogImageSource = post.seo?.ogImage || post.coverImage

  const ogImageUrl = ogImageSource
    ? urlForImage(ogImageSource as any).width(1200).height(630).url()
    : undefined

  // Build hreflang alternates dictionary
  const languageAlternates: Record<string, string> = {}
  if (post.translations && Array.isArray(post.translations)) {
    for (const tr of post.translations) {
      if (tr.locale && tr.slug) {
        languageAlternates[tr.locale] = `${baseUrl}/${tr.locale}/journal/${tr.slug}`
      }
    }
  }

  // Ensure current locale is present in hreflang
  languageAlternates[locale] = `${baseUrl}/${locale}/journal/${slug}`

  const enSlug = languageAlternates['en'] || `${baseUrl}/en/journal/${slug}`
  languageAlternates['x-default'] = enSlug

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${locale}/journal/${slug}`,
      languages: languageAlternates,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${baseUrl}/${locale}/journal/${slug}`,
      publishedTime: post.publishedAt,
      ...(ogImageUrl ? { images: [{ url: ogImageUrl, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImageUrl ? { images: [ogImageUrl] } : {}),
    },
  }
}

export default async function JournalDetailPage({ params }: PageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const post = await sanityFetch<typeof POST_BY_SLUG_QUERY>({
    query: POST_BY_SLUG_QUERY,
    params: { locale, slug },
    tags: ['post', `post:${locale}:${slug}`],
  }).catch(() => null as POST_BY_SLUG_QUERY_RESULT)

  if (!post || post.language !== locale) {
    notFound()
  }

  const t = await getTranslations({ locale, namespace: 'journal' })
  const marquee = post.marqueeText || `${post.title} — `

  const translations = (post.translations || [])
    .filter((tr) => Boolean(tr.locale && tr.slug))
    .map((tr) => ({ locale: tr.locale!, slug: tr.slug! }))

  return (
    <article className="min-h-screen pt-24 md:pt-32 pb-16">
      {/* Set translations in context for header language switcher */}
      <SetPostTranslations translations={translations} />

      {/* Back to Journal Navigation */}
      <div className="mx-auto max-w-7xl px-5 md:px-8 mb-8">
        <Link
          href="/journal"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors font-medium font-sans focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('backToList')}</span>
        </Link>
      </div>

      {/* Main Post Title Header (Semantic H1) */}
      <header className="mx-auto max-w-7xl px-5 md:px-8 mb-8 md:mb-12">
        {post.category?.title && (
          <div className="text-xs uppercase tracking-widest font-medium text-muted-foreground mb-3 font-sans">
            {post.category.title}
          </div>
        )}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground leading-[1.15] max-w-4xl">
          {post.title}
        </h1>
      </header>

      {/* Hero Image (Wide crop: ~2.3:1 desktop, 4:3 mobile) */}
      <div className="mx-auto max-w-7xl px-5 md:px-8 mb-12 md:mb-20">
        <div className="relative w-full overflow-hidden bg-muted aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] border border-border/40">
          <SanityImage
            image={post.coverImage}
            alt={post.coverImage?.alt || post.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
        </div>
      </div>

      {/* Moving Banner with Marquee Ticker */}
      <div className="mb-16 md:mb-24">
        <MovingBanner text={marquee} />
      </div>

      {/* Variable Post Length Body Content */}
      <div className="min-h-[200px]">
        <JournalBlocks
          blocks={(post.body as JournalBlockData[]) || []}
          categoryTitle={post.category?.title}
        />
      </div>

      {/* Back to Top Component */}
      <BackToTop label={t('backToTop')} />
    </article>
  )
}
