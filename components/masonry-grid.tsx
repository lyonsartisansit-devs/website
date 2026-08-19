'use client'

import React, { useState, useEffect } from 'react'

interface MasonryGridProps {
  children: React.ReactNode
  columns: { default: number; sm?: number; md?: number; lg?: number; xl?: number }
  gap?: number
  featuredFirstItem?: boolean
}

function getApproximateHeight(child: React.ReactNode): number {
  if (!React.isValidElement(child)) return 1;
  // Deep dive to find BlogCard's aspectRatio if it exists
  const blogCard = child.props.children; // Assuming child is the wrapper div
  if (React.isValidElement(blogCard) && blogCard.props && 'aspectRatio' in blogCard.props) {
    const ratio = blogCard.props.aspectRatio as string;
    if (ratio === '1/1') return 1.2; // roughly height including text
    if (ratio === '4/3') return 1.0; 
    if (ratio === '3/4') return 1.6;
    if (ratio === '16/9') return 0.8;
  }
  return 1;
}

export function MasonryGrid({ children, columns, gap = 24, featuredFirstItem = false }: MasonryGridProps) {
  const [cols, setCols] = useState(columns.default)

  useEffect(() => {
    const updateCols = () => {
      const width = window.innerWidth
      if (columns.xl && width >= 1280) setCols(columns.xl)
      else if (columns.lg && width >= 1024) setCols(columns.lg)
      else if (columns.md && width >= 768) setCols(columns.md)
      else if (columns.sm && width >= 640) setCols(columns.sm)
      else setCols(columns.default)
    }

    updateCols()
    window.addEventListener('resize', updateCols)
    return () => window.removeEventListener('resize', updateCols)
  }, [columns.default, columns.sm, columns.md, columns.lg, columns.xl])

  const childrenArray = React.Children.toArray(children)

  if (featuredFirstItem && cols >= 2 && childrenArray.length > 0) {
    const firstItem = childrenArray[0]
    const restItems = childrenArray.slice(1)
    
    // Approximate column heights to place items in the shortest column
    const colHeights = new Array(cols).fill(0);
    const colArrays: React.ReactNode[][] = Array.from({ length: cols }, () => []);
    
    // First item spans Col 0 and Col 1 (or just Col 0 if cols=2 and it spans both? Wait, if cols=2 it spans 0 & 1)
    const featuredHeight = getApproximateHeight(firstItem) * 2; // Roughly double because it's 2 cols wide
    colHeights[0] = featuredHeight;
    colHeights[1] = featuredHeight;
    // We don't push firstItem to colArrays because we render it separately spanning them

    restItems.forEach((child) => {
      const height = getApproximateHeight(child);
      
      // Find the shortest column
      let shortestCol = 0;
      let minHeight = Infinity;
      for (let i = 0; i < cols; i++) {
        if (colHeights[i] < minHeight) {
          minHeight = colHeights[i];
          shortestCol = i;
        }
      }
      
      colArrays[shortestCol].push(child);
      colHeights[shortestCol] += height;
    });

    if (cols === 2) {
       return (
         <div className="flex flex-col" style={{ gap: `${gap}px` }}>
           <div className="w-full">{firstItem}</div>
           <div className="flex" style={{ gap: `${gap}px` }}>
             <div className="flex-1 flex flex-col" style={{ gap: `${gap}px` }}>
               {colArrays[0]}
             </div>
             <div className="flex-1 flex flex-col" style={{ gap: `${gap}px` }}>
               {colArrays[1]}
             </div>
           </div>
         </div>
       )
    }

    if (cols === 4) {
      return (
         <div className="flex" style={{ gap: `${gap}px` }}>
           {/* Left 50% - Contains First Item, then Col 0 & Col 1 */}
           <div className="flex-[2] flex flex-col" style={{ gap: `${gap}px` }}>
             <div className="w-full">{firstItem}</div>
             <div className="flex" style={{ gap: `${gap}px` }}>
               <div className="flex-1 flex flex-col" style={{ gap: `${gap}px` }}>
                 {colArrays[0]}
               </div>
               <div className="flex-1 flex flex-col" style={{ gap: `${gap}px` }}>
                 {colArrays[1]}
               </div>
             </div>
           </div>
           
           {/* Right 50% - Contains Col 2 & Col 3 starting from the top */}
           <div className="flex-[2] flex" style={{ gap: `${gap}px` }}>
             <div className="flex-1 flex flex-col" style={{ gap: `${gap}px` }}>
               {colArrays[2]}
             </div>
             <div className="flex-1 flex flex-col" style={{ gap: `${gap}px` }}>
               {colArrays[3]}
             </div>
           </div>
         </div>
      )
    }
    
    if (cols === 3) {
      return (
         <div className="flex" style={{ gap: `${gap}px` }}>
           {/* Left 66% */}
           <div className="flex-[2] flex flex-col" style={{ gap: `${gap}px` }}>
             <div className="w-full">{firstItem}</div>
             <div className="flex" style={{ gap: `${gap}px` }}>
               <div className="flex-1 flex flex-col" style={{ gap: `${gap}px` }}>
                 {colArrays[0]}
               </div>
               <div className="flex-1 flex flex-col" style={{ gap: `${gap}px` }}>
                 {colArrays[1]}
               </div>
             </div>
           </div>
           
           {/* Right 33% */}
           <div className="flex-1 flex flex-col" style={{ gap: `${gap}px` }}>
             {colArrays[2]}
           </div>
         </div>
      )
    }
  }

  // Default behavior (no featured item)
  const colHeights = new Array(cols).fill(0);
  const colArrays: React.ReactNode[][] = Array.from({ length: cols }, () => []);
  
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      let shortestCol = 0;
      let minHeight = Infinity;
      for (let i = 0; i < cols; i++) {
        if (colHeights[i] < minHeight) {
          minHeight = colHeights[i];
          shortestCol = i;
        }
      }
      colArrays[shortestCol].push(child);
      colHeights[shortestCol] += getApproximateHeight(child);
    }
  });

  return (
    <div className="flex" style={{ gap: `${gap}px` }}>
      {colArrays.map((col, i) => (
        <div key={i} className="flex-1 flex flex-col" style={{ gap: `${gap}px` }}>
          {col}
        </div>
      ))}
    </div>
  )
}
