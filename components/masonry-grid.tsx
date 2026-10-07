'use client'

import React, { useState, useEffect } from 'react'

interface MasonryGridProps {
  children: React.ReactNode
  columns: { default: number; sm?: number; md?: number; lg?: number; xl?: number }
  gap?: number
  featuredFirstItem?: boolean
}

function getApproximateHeight(child: React.ReactNode): number {
  if (!React.isValidElement(child)) return 1

  // If child itself or child's first child has aspectRatio prop
  let ratioProp = (child.props as any)?.aspectRatio
  if (!ratioProp && React.isValidElement((child.props as any)?.children)) {
    ratioProp = ((child.props as any).children.props as any)?.aspectRatio
  }

  if (typeof ratioProp === 'number' && ratioProp > 0) {
    return 1 / ratioProp + 0.3 // height relative to width + card text offset
  }

  if (typeof ratioProp === 'string') {
    if (ratioProp === '16/9' || ratioProp === '16:9') return 0.86
    if (ratioProp === '4/3' || ratioProp === '4:3') return 1.05
    if (ratioProp === '1/1' || ratioProp === '1:1') return 1.3
    if (ratioProp === '4/5' || ratioProp === '4:5') return 1.55
    if (ratioProp === '3/4' || ratioProp === '3:4') return 1.63
    if (ratioProp.includes('/')) {
      const [w, h] = ratioProp.split('/').map(Number)
      if (w && h) return h / w + 0.3
    }
  }

  return 1.3
}

export function MasonryGrid({
  children,
  columns,
  gap = 32,
  featuredFirstItem = false,
}: MasonryGridProps) {
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

  const childrenArray = React.Children.toArray(children).filter(Boolean)

  if (childrenArray.length === 0) {
    return null
  }

  if (featuredFirstItem && cols >= 2 && childrenArray.length > 0) {
    const firstItem = childrenArray[0]
    const restItems = childrenArray.slice(1)

    // Column distribution
    const colHeights = new Array(cols).fill(0)
    const colArrays: React.ReactNode[][] = Array.from({ length: cols }, () => [])

    const featuredHeight = getApproximateHeight(firstItem) * 1.6
    colHeights[0] = featuredHeight
    colHeights[1] = featuredHeight

    restItems.forEach((child) => {
      const height = getApproximateHeight(child)

      let shortestCol = 0
      let minHeight = Infinity
      for (let i = 0; i < cols; i++) {
        if (colHeights[i] < minHeight) {
          minHeight = colHeights[i]
          shortestCol = i
        }
      }

      colArrays[shortestCol].push(child)
      colHeights[shortestCol] += height
    })

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
        <div className="flex flex-col lg:flex-row" style={{ gap: `${gap}px` }}>
          {/* Left 50% - Contains Featured First Item, then Col 0 & Col 1 */}
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

          {/* Right 50% - Contains Col 2 & Col 3 */}
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
        <div className="flex flex-col md:flex-row" style={{ gap: `${gap}px` }}>
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

  // Default behavior (no featured item or 1 column)
  const colHeights = new Array(cols).fill(0)
  const colArrays: React.ReactNode[][] = Array.from({ length: cols }, () => [])

  childrenArray.forEach((child) => {
    let shortestCol = 0
    let minHeight = Infinity
    for (let i = 0; i < cols; i++) {
      if (colHeights[i] < minHeight) {
        minHeight = colHeights[i]
        shortestCol = i
      }
    }
    colArrays[shortestCol].push(child)
    colHeights[shortestCol] += getApproximateHeight(child)
  })

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
