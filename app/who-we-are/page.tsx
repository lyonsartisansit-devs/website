'use client'

import { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useLanguage } from '@/components/language-provider'
import { PageHeader } from '@/components/page-header'
import { about } from '@/lib/i18n'

export default function WhoWeArePage() {
  const { lang } = useLanguage()
  const t = about[lang]
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.to('.about-hero-image', {
      scale: 1.15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.about-hero-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      }
    })

    const tlValues = gsap.timeline({
      scrollTrigger: {
        trigger: '.values-wrapper',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      }
    })

    const valueCards = gsap.utils.toArray('.value-card')

    // Initial state: cards are outside their grid cells
    if (valueCards.length >= 4) {
      gsap.set(valueCards[0], { xPercent: -120 })
      gsap.set(valueCards[1], { yPercent: 120 })
      gsap.set(valueCards[2], { yPercent: -120 })
      gsap.set(valueCards[3], { xPercent: 120 })

      // Phase 1: Slide in sequentially
      tlValues.to(valueCards[0], { xPercent: 0, duration: 1, ease: 'power2.out' })
      tlValues.to(valueCards[1], { yPercent: 0, duration: 1, ease: 'power2.out' })
      tlValues.to(valueCards[2], { yPercent: 0, duration: 1, ease: 'power2.out' })
      tlValues.to(valueCards[3], { xPercent: 0, duration: 1, ease: 'power2.out' })

      tlValues.to({}, { duration: 0.5 }) // small pause

      // Phase 2: Colors and textures
      const colors = ['#3B281C', '#6D4835', '#B5936F', '#E5D9CA']
      
      tlValues.to('.value-bg', {
        backgroundColor: (i) => colors[i],
        duration: 1,
        ease: 'none',
        stagger: 0.2
      }, 'colorChange')

      tlValues.to('.value-leather', {
        opacity: 0.85,
        duration: 1,
        ease: 'none',
        stagger: 0.2
      }, 'colorChange')

      tlValues.to('.value-gradient', {
        opacity: (index) => index === 2 ? 1 : 0, // Añade gradiente oscuro solo a la tarjeta 03
        duration: 1,
        ease: 'none',
        stagger: 0.2
      }, 'colorChange')

      tlValues.to('.value-number, .value-body, .value-title', {
        color: (index) => {
          const cardIndex = Math.floor(index / 3)
          // Card 03 (index 2) background is #B5936F but becomes dark with texture, so we use light text.
          // Card 04 (index 3) is #E5D9CA (cream) so we keep dark text.
          return cardIndex === 3 ? '#3B281C' : 'rgba(229, 217, 202, 0.9)'
        },
        duration: 1,
        ease: 'none',
        stagger: 0.2
      }, 'colorChange')
    }
  }, { scope: containerRef, dependencies: [lang] })

  return (
    <article ref={containerRef}>
      <PageHeader eyebrow={t.eyebrow} title={t.title} lead={t.lead} />

      <section className="about-hero-section relative mx-auto mb-24 max-w-7xl px-5 md:mb-32 md:px-8">
        <div className="relative aspect-[16/9] overflow-hidden rounded-sm bg-muted">
          <Image
            src="/images/about-hero.png"
            alt="Lyon's Artisans Atelier in León, México"
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            className="about-hero-image object-cover"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8 md:pb-32">
        <div className="grid gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-4">
            <p className="font-serif text-2xl font-light italic leading-snug text-primary md:text-3xl">
              León, México
            </p>
          </div>
          <div className="md:col-span-8">
            <div className="flex flex-col gap-6 text-lg leading-relaxed text-foreground/80">
              {t.body.map((p) => (
                <p key={p.slice(0, 24)} className="text-pretty">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="values-wrapper w-full h-[400vh] relative">
        <section className="values-section sticky top-0 flex h-screen w-full flex-col justify-center border-t border-border bg-card overflow-hidden">
          <div className="mx-auto w-full max-w-7xl px-5 md:px-8">
            <p className="font-subheading text-xs uppercase tracking-[0.3em] text-primary mb-12">
              {t.valuesLabel}
            </p>
            <div className="grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2">
              {t.values.map((v, i) => {
                const textures = [
                  '/images/leather-texture-croc.png',
                  '/images/leather-texture.png',
                  '/images/leather-texture-rough.png',
                  '/images/leather-texture-snake.png'
                ]
                return (
                  <div key={v.title} className="relative overflow-hidden bg-card h-full">
                    <div className="value-card relative flex h-full flex-col gap-3 p-8 md:p-10 border border-transparent overflow-hidden">
                      <div className="value-bg absolute inset-0 z-0 bg-card" />
                      <div className="value-leather absolute inset-0 z-10 opacity-0 pointer-events-none mix-blend-overlay">
                        <Image src={textures[i] || textures[0]} alt="" fill className="object-cover" />
                      </div>
                      <div className="value-gradient absolute inset-0 z-[15] opacity-0 pointer-events-none bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      
                      <span className="value-number font-mono text-xs tracking-widest text-muted-foreground relative z-20">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <h2 className="value-title font-serif text-2xl text-foreground relative z-20">{v.title}</h2>
                      <p className="value-body text-sm leading-relaxed text-muted-foreground relative z-20">
                        {v.body}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </div>
    </article>
  )
}
