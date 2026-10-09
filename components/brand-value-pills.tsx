'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface BrandValuePillsProps {
  values: string[]
  label?: string
  className?: string
}

const PARTICLES_CONFIG = [
  { angle: -35, distance: 22, size: 'w-1.5 h-1.5', bg: 'bg-primary' },
  { angle: -5, distance: 26, size: 'w-1 h-1', bg: 'bg-[#c9b6a3]' },
  { angle: 25, distance: 24, size: 'w-1.5 h-1.5', bg: 'bg-primary' },
  { angle: 65, distance: 20, size: 'w-1 h-1', bg: 'bg-[#d9cbba]' },
  { angle: 155, distance: 22, size: 'w-1.5 h-1.5', bg: 'bg-primary' },
  { angle: -145, distance: 24, size: 'w-1 h-1', bg: 'bg-[#c9b6a3]' },
  { angle: -90, distance: 22, size: 'w-1.5 h-1.5', bg: 'bg-primary' },
  { angle: 90, distance: 20, size: 'w-1 h-1', bg: 'bg-[#d9cbba]' },
]

export function BrandValuePills({ values, label, className }: BrandValuePillsProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!containerRef.current || values.length === 0) return

      const pillWrappers = gsap.utils.toArray<HTMLElement>(
        '.pill-wrapper',
        containerRef.current
      )

      if (pillWrappers.length === 0) return

      // Initial state setup
      pillWrappers.forEach((wrapper) => {
        const fillOverlay = wrapper.querySelector<HTMLElement>('.pill-fill-overlay')
        const splashRing = wrapper.querySelector<HTMLElement>('.splash-ring')
        const particles = wrapper.querySelectorAll<HTMLElement>('.splash-particle')

        if (fillOverlay) {
          gsap.set(fillOverlay, { clipPath: 'inset(0 100% 0 0)' })
        }
        if (splashRing) {
          gsap.set(splashRing, { scale: 0.95, opacity: 0 })
        }
        if (particles.length > 0) {
          gsap.set(particles, { x: 0, y: 0, scale: 0, opacity: 0 })
        }
      })

      // Master Timeline triggered when top of container is fully visible
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          once: true,
        },
      })

      pillWrappers.forEach((wrapper) => {
        const fillOverlay = wrapper.querySelector<HTMLElement>('.pill-fill-overlay')
        const pillItem = wrapper.querySelector<HTMLElement>('.pill-item')
        const splashRing = wrapper.querySelector<HTMLElement>('.splash-ring')
        const particles = wrapper.querySelectorAll<HTMLElement>('.splash-particle')

        // 1. Smooth fill from left to right
        if (fillOverlay) {
          tl.to(fillOverlay, {
            clipPath: 'inset(0 0% 0 0)',
            duration: 0.30,
            ease: 'power2.inOut',
          })
        }

        // 2. Splash effect (triggers immediately as the fill finishes)
        // Pill pop / subtle bounce
        if (pillItem) {
          tl.to(
            pillItem,
            {
              scale: 1.07,
              duration: 0.12,
              ease: 'power2.out',
              yoyo: true,
              repeat: 1,
            },
            '<0.45'
          )
        }

        // Splash ripple ring
        if (splashRing) {
          tl.fromTo(
            splashRing,
            { scale: 0.95, opacity: 0.8 },
            {
              scale: 1.35,
              opacity: 0,
              duration: 0.45,
              ease: 'power2.out',
            },
            '<'
          )
        }

        // Splash particles burst
        if (particles.length > 0) {
          particles.forEach((particle, pIdx) => {
            const config = PARTICLES_CONFIG[pIdx % PARTICLES_CONFIG.length]
            const rad = (config.angle * Math.PI) / 180
            const targetX = Math.cos(rad) * config.distance
            const targetY = Math.sin(rad) * config.distance

            tl.fromTo(
              particle,
              { x: 0, y: 0, scale: 0.4, opacity: 1 },
              {
                x: targetX,
                y: targetY,
                scale: 1.2,
                opacity: 0,
                duration: 0.42,
                ease: 'power3.out',
              },
              '<'
            )
          })
        }

        // Short pause before next pill begins
        tl.to({}, { duration: 0.12 })
      })
    },
    { scope: containerRef, dependencies: [values] }
  )

  return (
    <div ref={containerRef} className={cn('mt-2', className)}>
      {label && (
        <p className="font-subheading text-xs uppercase tracking-[0.28em] text-muted-foreground">
          {label}
        </p>
      )}
      <ul className="mt-3 flex flex-wrap gap-2.5">
        {values.map((v, i) => (
          <li
            key={`${v}-${i}`}
            className="pill-wrapper relative inline-flex items-center select-none hover:scale-110 transition-transform duration-300 ease-out"
          >
            {/* Pill Base */}
            <div className="pill-item relative flex items-center justify-center rounded-full bg-card/60 px-3.5 py-1.5 text-xs tracking-wide text-foreground/80 overflow-hidden shadow-2xs">
              {/* Inner Dotted Border (Base) */}
              <span
                className="pointer-events-none absolute inset-[2px] rounded-full border border-dotted border-foreground/35 z-10"
                aria-hidden="true"
              />

              {/* Base text */}
              <span className="relative z-10 text-foreground/75 font-medium transition-colors">
                {v}
              </span>

              {/* Filling Overlay (Left-to-Right reveal) */}
              <div
                className="pill-fill-overlay pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-3.5 py-1.5 bg-primary text-primary-foreground overflow-hidden"
                style={{ clipPath: 'inset(0 100% 0 0)' }}
                aria-hidden="true"
              >
                {/* Inner Dotted Border (Filled state - high contrast stitched look) */}
                <span
                  className="pointer-events-none absolute inset-[2px] rounded-full border border-dotted border-primary-foreground/40"
                  aria-hidden="true"
                />
                {/* Filled text */}
                <span className="font-medium text-primary-foreground whitespace-nowrap">
                  {v}
                </span>
              </div>
            </div>

            {/* Splash Elements Container */}
            <div className="splash-container pointer-events-none absolute inset-0 z-30 flex items-center justify-center overflow-visible">
              {/* Expanding Ripple Ring */}
              <span className="splash-ring absolute inset-0 rounded-full border border-primary/40 pointer-events-none" />

              {/* Splash Micro Particles */}
              {PARTICLES_CONFIG.map((p, pIdx) => (
                <span
                  key={pIdx}
                  className={cn(
                    'splash-particle absolute rounded-full pointer-events-none',
                    p.size,
                    p.bg
                  )}
                  style={{
                    top: '50%',
                    left: '50%',
                    marginTop: '-2px',
                    marginLeft: '-2px',
                  }}
                />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
