import { defineQuery } from 'next-sanity'

export const JOURNAL_PAGE_QUERY = defineQuery(`
  *[_type == "journalPage" && language == $locale][0] {
    _id,
    _type,
    language,
    eyebrow,
    heading,
    seo {
      title,
      description,
      ogImage {
        asset->{
          _id,
          url,
          metadata {
            lqip,
            dimensions { width, height }
          }
        },
        alt,
        hotspot,
        crop
      }
    }
  }
`)

export const CATEGORIES_QUERY = defineQuery(`
  *[_type == "category" && language == $locale] | order(order asc, title asc) {
    _id,
    _type,
    language,
    title,
    "slug": slug.current,
    order
  }
`)

export const POSTS_QUERY = defineQuery(`
  *[_type == "post" && language == $locale && defined(slug.current)] | order(publishedAt desc) {
    _id,
    _type,
    language,
    title,
    "slug": slug.current,
    excerpt,
    featured,
    publishedAt,
    category->{
      _id,
      title,
      "slug": slug.current
    },
    coverImage {
      asset->{
        _id,
        url,
        metadata {
          lqip,
          dimensions { width, height, aspectRatio }
        }
      },
      alt,
      hotspot,
      crop
    }
  }
`)

export const POST_BY_SLUG_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug && language == $locale][0] {
    _id,
    _type,
    language,
    title,
    "slug": slug.current,
    excerpt,
    featured,
    publishedAt,
    marqueeText,
    category->{
      _id,
      title,
      "slug": slug.current
    },
    coverImage {
      asset->{
        _id,
        url,
        metadata {
          lqip,
          dimensions { width, height, aspectRatio }
        }
      },
      alt,
      hotspot,
      crop
    },
    body[] {
      _key,
      _type,
      _type == "textSection" => {
        label,
        lead,
        body
      },
      _type == "imageGallery" => {
        images[] {
          _key,
          asset->{
            _id,
            url,
            metadata {
              lqip,
              dimensions { width, height, aspectRatio }
            }
          },
          alt,
          hotspot,
          crop
        }
      },
      _type == "pullQuote" => {
        quote,
        supportingText
      }
    },
    seo {
      title,
      description,
      ogImage {
        asset->{
          _id,
          url,
          metadata {
            lqip,
            dimensions { width, height }
          }
        },
        alt,
        hotspot,
        crop
      }
    },
    "translations": *[_type == "translation.metadata" && references(^._id)][0].translations[] {
      "locale": _key,
      "slug": value->slug.current
    }
  }
`)

export const POST_SLUGS_BY_LOCALE_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)] {
    language,
    "slug": slug.current
  }
`)

export const ALL_POSTS_SITEMAP_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)] {
    _id,
    language,
    "slug": slug.current,
    _updatedAt,
    "translations": *[_type == "translation.metadata" && references(^._id)][0].translations[] {
      "locale": _key,
      "slug": value->slug.current
    }
  }
`)
