import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface BlogCardProps {
  slug: string
  image: string
  title: string
  excerpt: string
  category: string
  readMoreText: string
  aspectRatio?: string
  className?: string
}

export function BlogCard({
  slug,
  image,
  title,
  excerpt,
  category,
  readMoreText,
  aspectRatio = '3/4',
  className
}: BlogCardProps) {
  return (
    <Link href={`/journal/${slug}`} className={cn("group flex flex-col gap-4", className)}>
      <div className="relative w-full overflow-hidden" style={{ aspectRatio }}>
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="font-serif text-xl leading-tight md:text-2xl">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3">{excerpt}</p>
        <div className="mt-2 flex items-center gap-3">
          <div className="h-[2px] w-8 bg-foreground transition-all duration-300 group-hover:w-12" />
          <span className="font-sans text-sm font-medium tracking-wide uppercase">{readMoreText}</span>
        </div>
      </div>
    </Link>
  )
}
