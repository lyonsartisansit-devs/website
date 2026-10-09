import React from 'react'

interface JsonLdProps {
  data: Record<string, any>
}

/**
 * Renders JSON-LD structured data in a secure, non-rendered script tag.
 * Safely stringifies data for SEO & AEO (Answer Engine Optimization) crawlers.
 */
export function JsonLd({ data }: JsonLdProps) {
  if (!data) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}
