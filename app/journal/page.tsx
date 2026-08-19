'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useLanguage } from '@/components/language-provider'
import { blogData, mockBlogs } from '@/lib/i18n'
import { PageHeader } from '@/components/page-header'
import { CategoryFilter } from '@/components/category-filter'
import { MasonryGrid } from '@/components/masonry-grid'
import { BlogCard } from '@/components/blog-card'

const ITEMS_PER_PAGE = 5

export default function BlogPage() {
  const { lang } = useLanguage()
  const data = blogData[lang]
  const [activeCategories, setActiveCategories] = useState<string[]>([data.filters[0]])
  const [displayedBlogs, setDisplayedBlogs] = useState(mockBlogs.slice(0, ITEMS_PER_PAGE))
  const [page, setPage] = useState(1)
  const loaderRef = useRef<HTMLDivElement>(null)

  const filteredBlogs = React.useMemo(() => mockBlogs.filter((blog) => {
    if (activeCategories.includes(data.filters[0])) return true // "All" or "Todos"
    return activeCategories.includes(blog.category[lang])
  }), [activeCategories, data.filters, lang])

  useEffect(() => {
    // Reset when category changes, unless it's just a language switch
    setPage(1)
    setDisplayedBlogs(filteredBlogs.slice(0, ITEMS_PER_PAGE))
  }, [activeCategories, lang, filteredBlogs])

  // Gracefully map active categories when language changes so they aren't lost
  useEffect(() => {
    const currentFilters = blogData[lang].filters;
    const enFilters = blogData['en'].filters;
    const esFilters = blogData['es'].filters;
    
    const isValid = activeCategories.every(cat => currentFilters.includes(cat));
    
    if (!isValid) {
       const mappedCategories = activeCategories.map(cat => {
         const enIndex = enFilters.indexOf(cat);
         if (enIndex !== -1) return currentFilters[enIndex];
         const esIndex = esFilters.indexOf(cat);
         if (esIndex !== -1) return currentFilters[esIndex];
         return currentFilters[0];
       });
       
       const newCategories = Array.from(new Set(mappedCategories)).filter(Boolean);
       setActiveCategories(newCategories.length > 0 ? newCategories : [currentFilters[0]]);
    }
  }, [lang, activeCategories, blogData]);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0]
    if (target.isIntersecting && displayedBlogs.length < filteredBlogs.length) {
      setPage((prev) => prev + 1)
    }
  }, [displayedBlogs.length, filteredBlogs.length])

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: '20px',
      threshold: 0
    }
    const observer = new IntersectionObserver(handleObserver, option)
    if (loaderRef.current) observer.observe(loaderRef.current)
    
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current)
    }
  }, [handleObserver])

  useEffect(() => {
    if (page > 1) {
      setDisplayedBlogs(filteredBlogs.slice(0, page * ITEMS_PER_PAGE))
    }
  }, [page, filteredBlogs])

  // Simple deterministic pseudo-random aspect ratio based on ID
  const getAspectRatio = (id: string) => {
    const num = parseInt(id, 10)
    if (num % 3 === 0) return '16/9'
    if (num % 2 === 0) return '4/5'
    return '3/4'
  }

  const handleCategorySelect = (category: string) => {
    const isAll = category === data.filters[0]
    
    if (isAll) {
      setActiveCategories([category])
      return
    }

    let newCategories = [...activeCategories]
    
    // Remove "All" if it was selected
    if (newCategories.includes(data.filters[0])) {
      newCategories = newCategories.filter(c => c !== data.filters[0])
    }
    
    if (newCategories.includes(category)) {
      // Deselect
      newCategories = newCategories.filter(c => c !== category)
      // If we deselected the last one, fallback to "All"
      if (newCategories.length === 0) {
        newCategories = [data.filters[0]]
      }
    } else {
      // Select
      newCategories.push(category)
    }
    
    setActiveCategories(newCategories)
  }

  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12 border-b border-border pb-12">
          <PageHeader eyebrow={data.eyebrow} title={data.title} />
          
          <div className="flex flex-col items-start md:items-end">
            <CategoryFilter
              categories={data.filters}
              activeCategories={activeCategories}
              onSelect={handleCategorySelect}
            />
          </div>
        </div>

        <MasonryGrid columns={{ default: 1, sm: 2, lg: 4 }} gap={32} featuredFirstItem={true}>
          {displayedBlogs.map((blog) => (
            <div key={blog.id} className="break-inside-avoid">
              <BlogCard
                slug={blog.slug}
                image={blog.image}
                title={blog.title[lang]}
                excerpt={blog.excerpt[lang]}
                category={blog.category[lang]}
                readMoreText={data.readMore}
                aspectRatio={getAspectRatio(blog.id)}
              />
            </div>
          ))}
        </MasonryGrid>

        {displayedBlogs.length < filteredBlogs.length && (
          <div ref={loaderRef} className="py-12 flex justify-center">
            <div className="h-6 w-6 rounded-full border-2 border-foreground border-t-transparent animate-spin" />
          </div>
        )}
      </div>
    </main>
  )
}
