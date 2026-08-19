import React from 'react'
import { cn } from '@/lib/utils'

interface MovingBannerProps {
  text: string
  className?: string
}

export function MovingBanner({ text, className }: MovingBannerProps) {
  // Repeat the text multiple times to ensure the screen is filled
  const repeatedText = Array(10).fill(text)

  return (
    <div className={cn("relative flex w-full overflow-hidden bg-primary text-primary-foreground py-4 sm:py-6 md:py-8", className)}>
      <div className="flex animate-marquee whitespace-nowrap">
        {repeatedText.map((t, i) => (
          <span key={i} className="mx-4 font-serif text-3xl md:text-5xl lg:text-7xl">
            {t}
          </span>
        ))}
      </div>
      <div className="flex absolute top-0 animate-marquee2 whitespace-nowrap py-4 sm:py-6 md:py-8">
        {repeatedText.map((t, i) => (
          <span key={i} className="mx-4 font-serif text-3xl md:text-5xl lg:text-7xl">
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}
