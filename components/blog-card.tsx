import { Link } from '@/i18n/routing'
import { cn } from '@/lib/utils'
import { SanityImage, type SanityImageSourceProps } from './sanity-image'

interface BlogCardProps {
  slug: string
  coverImage?: SanityImageSourceProps | null
  fallbackImage?: string
  title: string
  excerpt: string
  category?: string | null
  readMoreText?: string
  aspectRatio?: string | number
  className?: string
  featured?: boolean
}

export function BlogCard({
  slug,
  coverImage,
  fallbackImage,
  title,
  excerpt,
  category,
  readMoreText = 'Read Story',
  aspectRatio,
  className,
  featured = false,
}: BlogCardProps) {
  // If numeric aspect ratio or string, compute CSS aspect ratio
  const styleAspectRatio =
    typeof aspectRatio === 'number'
      ? `${aspectRatio}`
      : aspectRatio || '4/3'

  return (
    <article className={cn('group flex flex-col', className)}>
      <Link
        href={`/journal/${slug}` as any}
        className="flex flex-col gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 rounded-sm"
      >
        <div
          className="relative w-full overflow-hidden bg-muted/40 border border-border/40 transition-colors group-hover:border-foreground/30"
          style={{ aspectRatio: styleAspectRatio }}
        >
          {coverImage ? (
            <SanityImage
              image={coverImage}
              alt={coverImage.alt || title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              aspectRatioClamp={{ min: 0.75, max: 1.777 }} // 3:4 to 16:9
              sizes={
                featured
                  ? '(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw'
                  : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
              }
            />
          ) : fallbackImage ? (
            // Fallback plain image if seeded without Sanity asset
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={fallbackImage}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground text-xs uppercase tracking-widest">
              Lyon&apos;s Artisans
            </div>
          )}

          {category && (
            <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1 text-[11px] uppercase tracking-widest font-medium text-foreground border border-border/50">
              {category}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2.5 pt-1">
          <h3
            className={cn(
              'font-serif leading-snug text-foreground transition-colors group-hover:text-foreground/80',
              featured ? 'text-2xl md:text-3xl lg:text-4xl' : 'text-xl md:text-2xl'
            )}
          >
            {title}
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed font-sans">
            {excerpt}
          </p>

          <div className="mt-2 flex items-center gap-3">
            <div className="h-[1.5px] w-7 bg-foreground transition-all duration-300 group-hover:w-12 group-hover:bg-primary" />
            <span className="font-sans text-xs font-semibold tracking-widest uppercase text-foreground">
              {readMoreText}
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
