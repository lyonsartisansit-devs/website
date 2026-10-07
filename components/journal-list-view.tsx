'use client'

import React, { useTransition, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/routing'
import { PageHeader } from '@/components/page-header'
import { CategoryFilter, type FilterCategoryItem } from '@/components/category-filter'
import { MasonryGrid } from '@/components/masonry-grid'
import { BlogCard } from '@/components/blog-card'
import type { POSTS_QUERY_RESULT, CATEGORIES_QUERY_RESULT } from '@/sanity.types'

interface JournalListViewProps {
  eyebrow?: string | null
  heading?: string | null
  categories: CATEGORIES_QUERY_RESULT
  posts: POSTS_QUERY_RESULT
}

function JournalListContent({
  eyebrow,
  heading,
  categories,
  posts,
}: JournalListViewProps) {
  const t = useTranslations('journal')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const currentCategorySlug = searchParams.get('category') || 'all'

  // Map Sanity categories to FilterCategoryItem format
  const filterCategories: FilterCategoryItem[] = categories
    .filter((c) => Boolean(c.title && c.slug))
    .map((c) => ({
      id: c._id,
      title: c.title!,
      slug: c.slug!,
    }))

  const handleCategorySelect = (slug: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (slug === 'all' || !slug) {
        params.delete('category')
      } else {
        params.set('category', slug)
      }
      const query = params.toString() ? `?${params.toString()}` : ''
      router.push(`${pathname}${query}` as any, { scroll: false })
    })
  }

  // Filter posts client-side
  const filteredPosts = React.useMemo(() => {
    if (!currentCategorySlug || currentCategorySlug === 'all') {
      return posts
    }
    return posts.filter((post) => post.category?.slug === currentCategorySlug)
  }, [posts, currentCategorySlug])

  // Determine featured post
  const { featuredPost, otherPosts } = React.useMemo(() => {
    if (filteredPosts.length === 0) {
      return { featuredPost: null, otherPosts: [] }
    }

    const featuredIdx = filteredPosts.findIndex((p) => p.featured === true)
    if (featuredIdx !== -1) {
      const featured = filteredPosts[featuredIdx]
      const others = filteredPosts.filter((_, idx) => idx !== featuredIdx)
      return { featuredPost: featured, otherPosts: others }
    }

    return {
      featuredPost: filteredPosts[0],
      otherPosts: filteredPosts.slice(1),
    }
  }, [filteredPosts])

  // Helper to compute aspect ratio clamped between 3:4 (0.75) and 16:9 (1.777)
  const getClampedAspectRatio = (post: (typeof posts)[number]) => {
    const rawRatio = post.coverImage?.asset?.metadata?.dimensions?.aspectRatio
    if (!rawRatio) return 1.33 // default 4/3
    return Math.max(0.75, Math.min(1.777, rawRatio))
  }

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {/* Header and Filter Row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12 md:mb-16 border-b border-border pb-10">
          <PageHeader
            eyebrow={eyebrow || t('eyebrow')}
            title={heading || t('heading')}
          />

          <div className="flex flex-col items-start md:items-end">
            <CategoryFilter
              categories={filterCategories}
              activeSlug={currentCategorySlug}
              onSelect={handleCategorySelect}
              allLabel={t('all')}
            />
          </div>
        </div>

        {/* Loading indicator when transitioning category filters */}
        {isPending && (
          <div className="py-4 text-xs tracking-widest uppercase text-muted-foreground animate-pulse">
            {t('updatingStories')}
          </div>
        )}

        {/* Empty State */}
        {filteredPosts.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center border border-dashed border-border/70 rounded-sm p-8 my-8">
            <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-3">
              {t('noStoriesFound')}
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto mb-6">
              {t('noStoriesDescription')}
            </p>
            <button
              type="button"
              onClick={() => handleCategorySelect('all')}
              className="px-6 py-2.5 text-xs uppercase tracking-widest font-medium bg-foreground text-background border border-foreground hover:bg-foreground/90 transition-colors cursor-pointer"
            >
              {t('viewAllStories')}
            </button>
          </div>
        ) : (
          /* Masonry Grid with Featured First Item */
          <MasonryGrid
            columns={{ default: 1, sm: 2, lg: 4 }}
            gap={48}
            featuredFirstItem={Boolean(featuredPost)}
          >
            {featuredPost && (
              <div key={featuredPost._id} className="break-inside-avoid">
                <BlogCard
                  slug={featuredPost.slug!}
                  coverImage={featuredPost.coverImage}
                  title={featuredPost.title}
                  excerpt={featuredPost.excerpt}
                  category={featuredPost.category?.title}
                  readMoreText={t('readMore')}
                  aspectRatio={getClampedAspectRatio(featuredPost)}
                  featured={true}
                />
              </div>
            )}

            {otherPosts.map((post) => (
              <div key={post._id} className="break-inside-avoid">
                <BlogCard
                  slug={post.slug!}
                  coverImage={post.coverImage}
                  title={post.title}
                  excerpt={post.excerpt}
                  category={post.category?.title}
                  readMoreText={t('readMore')}
                  aspectRatio={getClampedAspectRatio(post)}
                  featured={false}
                />
              </div>
            ))}
          </MasonryGrid>
        )}
      </div>
    </div>
  )
}

export function JournalListView(props: JournalListViewProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-24 md:pt-32 pb-24 mx-auto max-w-7xl px-5 md:px-8">
          <div className="h-10 w-48 bg-muted animate-pulse mb-8" />
          <div className="h-64 w-full bg-muted animate-pulse" />
        </div>
      }
    >
      <JournalListContent {...props} />
    </Suspense>
  )
}
