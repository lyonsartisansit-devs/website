import { cn } from '@/lib/utils'

interface CategoryFilterProps {
  categories: string[]
  activeCategories: string[]
  onSelect: (category: string) => void
}

export function CategoryFilter({ categories, activeCategories, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 md:gap-4">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={cn(
            "px-4 py-2 text-xs uppercase tracking-widest transition-colors duration-300 border",
            activeCategories.includes(category)
              ? "bg-foreground text-background border-foreground"
              : "bg-transparent text-foreground border-border hover:border-foreground/50"
          )}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
