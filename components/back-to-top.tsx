'use client'

import React from 'react'
import { ArrowUp } from 'lucide-react'

interface BackToTopProps {
  label?: string
}

export function BackToTop({ label = 'Back to top' }: BackToTopProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="mx-auto max-w-7xl px-5 md:px-8 pt-12 md:pt-16 pb-12 flex justify-center">
      <button
        type="button"
        onClick={scrollToTop}
        className="flex flex-col items-center gap-3 group text-muted-foreground hover:text-foreground transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
        aria-label="Scroll back to top of the page"
      >
        <div className="h-12 w-12 rounded-full border border-border flex items-center justify-center group-hover:border-foreground transition-colors bg-background">
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
        </div>
        <span className="text-xs uppercase tracking-widest font-medium font-sans">
          {label}
        </span>
      </button>
    </div>
  )
}
