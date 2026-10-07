'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export interface FilterCategoryItem {
  id: string
  title: string
  slug: string
}

interface CategoryFilterProps {
  categories: FilterCategoryItem[]
  activeSlug: string
  onSelect: (slug: string) => void
  allLabel?: string
}

export function CategoryFilter({
  categories,
  activeSlug,
  onSelect,
  allLabel = 'All',
}: CategoryFilterProps) {
  const allItems: FilterCategoryItem[] = [
    { id: 'all', title: allLabel, slug: 'all' },
    ...categories,
  ]

  return (
    <nav aria-label="Filter journal posts by category" className="w-full">
      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        {allItems.map((item) => {
          const isSelected =
            item.slug === activeSlug ||
            (item.slug === 'all' && (!activeSlug || activeSlug === 'all'))

          return (
            <button
              key={item.id || item.slug}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(item.slug)}
              className={cn(
                'px-4 py-2 text-xs uppercase tracking-widest font-medium transition-all duration-300 border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 cursor-pointer',
                isSelected
                  ? 'bg-foreground text-background border-foreground shadow-sm'
                  : 'bg-transparent text-foreground border-border hover:border-foreground/60 hover:bg-foreground/5'
              )}
            >
              {item.title}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
