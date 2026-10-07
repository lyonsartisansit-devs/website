import React from 'react'
import { SanityImage, type SanityImageSourceProps } from './sanity-image'
import { SanityPortableText } from './portable-text'
import { cn } from '@/lib/utils'

export interface TextSectionBlockData {
  _key: string
  _type: 'textSection'
  label?: string | null
  lead?: string | null
  body?: any
}

export interface ImageGalleryBlockData {
  _key: string
  _type: 'imageGallery'
  images?: Array<{
    _key: string
    asset?: {
      _id?: string
      url?: string
      metadata?: {
        lqip?: string | null
        dimensions?: {
          width?: number
          height?: number
          aspectRatio?: number
        } | null
      } | null
    } | null
    alt?: string | null
    hotspot?: {
      x: number
      y: number
      height?: number
      width?: number
    } | null
    crop?: {
      top: number
      bottom: number
      left: number
      right: number
    } | null
  }> | null
}

export interface PullQuoteBlockData {
  _key: string
  _type: 'pullQuote'
  quote?: string | null
  supportingText?: string | null
}

export type JournalBlockData =
  | TextSectionBlockData
  | ImageGalleryBlockData
  | PullQuoteBlockData

interface JournalBlocksProps {
  blocks: JournalBlockData[] | null | undefined
  categoryTitle?: string | null
}

export function JournalBlocks({ blocks, categoryTitle }: JournalBlocksProps) {
  if (!blocks || blocks.length === 0) {
    return null
  }

  let textSectionIndex = 0

  return (
    <div className="flex flex-col space-y-16 md:space-y-24">
      {blocks.map((block) => {
        if (!block || !block._type) return null

        switch (block._type) {
          case 'textSection': {
            const currentIdx = textSectionIndex
            textSectionIndex++

            // For the first textSection, label defaults to category title
            const displayLabel =
              block.label ||
              (currentIdx === 0 && categoryTitle ? categoryTitle : null)

            const hasLead = Boolean(block.lead && block.lead.trim())
            const hasBody = Boolean(
              block.body &&
                (Array.isArray(block.body) ? block.body.length > 0 : true)
            )

            if (!displayLabel && !hasLead && !hasBody) {
              return null
            }

            return (
              <section
                key={block._key}
                className="mx-auto w-full max-w-4xl px-5 md:px-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-16">
                  {/* Left Column: Label */}
                  <div className="md:col-span-4">
                    {displayLabel ? (
                      <h3 className="text-xs uppercase tracking-widest text-muted-foreground border-b border-border pb-3 mb-4 font-sans font-medium">
                        {displayLabel}
                      </h3>
                    ) : (
                      <div className="hidden md:block" aria-hidden="true" />
                    )}
                  </div>

                  {/* Right Column: Lead statement + Portable Text body */}
                  <div className="md:col-span-8 flex flex-col">
                    {hasLead && (
                      <p className="font-serif text-2xl md:text-3xl leading-relaxed text-foreground mb-8">
                        {block.lead}
                      </p>
                    )}
                    {hasBody && <SanityPortableText value={block.body} />}
                  </div>
                </div>
              </section>
            )
          }

          case 'imageGallery': {
            const galleryImages = block.images || []
            if (galleryImages.length === 0) return null

            const count = galleryImages.length

            // Determine grid columns and aspect ratio based on image count
            let gridClass = 'grid-cols-1'
            let aspectClass = 'aspect-[16/9] md:aspect-[21/9]'

            if (count === 2) {
              gridClass = 'grid-cols-1 md:grid-cols-2'
              aspectClass = 'aspect-[4/3]'
            } else if (count === 3) {
              gridClass = 'grid-cols-1 md:grid-cols-3'
              aspectClass = 'aspect-[4/3] md:aspect-[3/4]'
            } else if (count === 4) {
              gridClass = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
              aspectClass = 'aspect-[4/3] sm:aspect-[3/4]'
            }

            return (
              <section
                key={block._key}
                className="mx-auto w-full max-w-7xl px-5 md:px-8"
              >
                <div className={cn('grid gap-6 md:gap-8', gridClass)}>
                  {galleryImages.map((imgItem, idx) => (
                    <div
                      key={imgItem._key || idx}
                      className={cn(
                        'relative w-full overflow-hidden bg-muted/30 border border-border/40',
                        aspectClass
                      )}
                    >
                      <SanityImage
                        image={imgItem as SanityImageSourceProps}
                        fill
                        className="object-cover"
                        sizes={
                          count === 1
                            ? '(max-width: 1280px) 100vw, 1280px'
                            : count === 2
                            ? '(max-width: 768px) 100vw, 50vw'
                            : count === 3
                            ? '(max-width: 768px) 100vw, 33vw'
                            : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
                        }
                      />
                    </div>
                  ))}
                </div>
              </section>
            )
          }

          case 'pullQuote': {
            if (!block.quote || !block.quote.trim()) return null

            const hasSupporting = Boolean(
              block.supportingText && block.supportingText.trim()
            )

            return (
              <section
                key={block._key}
                className="w-full bg-card border-y border-border/40 py-16 md:py-24 my-4"
              >
                <div className="mx-auto max-w-4xl px-5 md:px-8 text-center">
                  <blockquote className="font-serif text-3xl md:text-5xl lg:text-6xl text-foreground leading-tight">
                    “{block.quote}”
                  </blockquote>
                  {hasSupporting && (
                    <p className="mt-8 text-center font-sans text-muted-foreground text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
                      {block.supportingText}
                    </p>
                  )}
                </div>
              </section>
            )
          }

          default:
            return null
        }
      })}
    </div>
  )
}
