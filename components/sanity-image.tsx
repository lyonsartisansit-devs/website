import Image, { type ImageProps } from 'next/image'
import { urlForImage } from '@/sanity/lib/image'

export interface SanityImageSourceProps {
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
}

interface SanityImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  image: SanityImageSourceProps | null | undefined
  alt?: string
  fallbackAlt?: string
  aspectRatioClamp?: { min: number; max: number } // e.g., { min: 0.75, max: 1.777 } (3:4 to 16:9)
}

export function SanityImage({
  image,
  alt,
  fallbackAlt = "Lyon's Artisans",
  aspectRatioClamp,
  className,
  style,
  priority = false,
  fill,
  width,
  height,
  sizes,
  ...props
}: SanityImageProps) {
  if (!image || (!image.asset && !(image as any)._ref)) {
    return null
  }

  const altText = alt || image.alt || fallbackAlt
  const lqip = image.asset?.metadata?.lqip
  const rawAspectRatio = image.asset?.metadata?.dimensions?.aspectRatio

  // Calculate clamped aspect ratio if requested
  let computedAspectRatio: number | undefined = rawAspectRatio
  if (computedAspectRatio && aspectRatioClamp) {
    computedAspectRatio = Math.max(
      aspectRatioClamp.min,
      Math.min(aspectRatioClamp.max, computedAspectRatio)
    )
  }

  // Hotspot object position
  const objectPosition = image.hotspot
    ? `${Math.round(image.hotspot.x * 100)}% ${Math.round(image.hotspot.y * 100)}%`
    : 'center'

  const imageUrl = urlForImage(image as any).url()

  if (fill) {
    return (
      <Image
        src={imageUrl}
        alt={altText}
        fill
        className={className}
        style={{
          objectPosition,
          ...style,
        }}
        priority={priority}
        sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
        placeholder={lqip ? 'blur' : 'empty'}
        blurDataURL={lqip || undefined}
        {...props}
      />
    )
  }

  const imgWidth = (width as number) || image.asset?.metadata?.dimensions?.width || 1200
  const imgHeight =
    (height as number) ||
    (computedAspectRatio
      ? Math.round(imgWidth / computedAspectRatio)
      : image.asset?.metadata?.dimensions?.height || 800)

  return (
    <Image
      src={imageUrl}
      alt={altText}
      width={imgWidth}
      height={imgHeight}
      className={className}
      style={{
        objectPosition,
        ...style,
      }}
      priority={priority}
      sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
      placeholder={lqip ? 'blur' : 'empty'}
      blurDataURL={lqip || undefined}
      {...props}
    />
  )
}
