import type { MetadataRoute } from 'next'
import { sanityFetch } from '@/sanity/lib/client'
import { ALL_POSTS_SITEMAP_QUERY } from '@/sanity/lib/queries'
import { locales } from '@/i18n/routing'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lyonsartisans.mx'

  const staticPaths = [
    '',
    '/journal',
    '/collections',
    '/craftsmanship',
    '/process',
    '/who-we-are',
    '/contact',
  ]

  const staticEntries: MetadataRoute.Sitemap = []

  for (const path of staticPaths) {
    for (const locale of locales) {
      const url = `${baseUrl}/${locale}${path}`
      const languages: Record<string, string> = {}
      for (const loc of locales) {
        languages[loc] = `${baseUrl}/${loc}${path}`
      }
      languages['x-default'] = `${baseUrl}/en${path}`

      staticEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: path === '' ? 1.0 : path === '/journal' ? 0.9 : 0.8,
        alternates: {
          languages,
        },
      })
    }
  }

  try {
    const posts = await sanityFetch<typeof ALL_POSTS_SITEMAP_QUERY>({
      query: ALL_POSTS_SITEMAP_QUERY,
      tags: ['post'],
    })

    const postEntries: MetadataRoute.Sitemap = (posts || [])
      .filter((post) => Boolean(post.slug && post.language))
      .map((post) => {
        const url = `${baseUrl}/${post.language}/journal/${post.slug}`
        const languages: Record<string, string> = {}

        if (post.translations && Array.isArray(post.translations)) {
          for (const tr of post.translations) {
            if (tr.locale && tr.slug) {
              languages[tr.locale] = `${baseUrl}/${tr.locale}/journal/${tr.slug}`
            }
          }
        }
        languages[post.language!] = url
        languages['x-default'] = languages['en'] || url

        return {
          url,
          lastModified: post._updatedAt ? new Date(post._updatedAt) : new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
          alternates: {
            languages,
          },
        }
      })

    return [...staticEntries, ...postEntries]
  } catch {
    return staticEntries
  }
}
