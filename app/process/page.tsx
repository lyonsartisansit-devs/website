'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, Box, Lightbulb, Shapes, Scissors, MoveDiagonal, Wrench, Paintbrush, ShieldCheck, Package } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import { PageHeader } from '@/components/page-header'
import { FloatingProcessNav } from '@/components/floating-process-nav'
import { cn } from '@/lib/utils'
import { process, routes, nav } from '@/lib/i18n'

export default function ProcessPage() {
  const { lang } = useLanguage()
  const t = process[lang]
  const n = nav[lang]

  const getIcon = (index: number) => {
    switch (index) {
      case 0: return <Box className="w-6 h-6 stroke-[1.5]" />
      case 1: return <Lightbulb className="w-6 h-6 stroke-[1.5]" />
      case 2: return <Shapes className="w-6 h-6 stroke-[1.5]" />
      case 3: return <Scissors className="w-6 h-6 stroke-[1.5]" />
      case 4: return <MoveDiagonal className="w-6 h-6 stroke-[1.5]" />
      case 5: return <Wrench className="w-6 h-6 stroke-[1.5]" />
      case 6: return <Paintbrush className="w-6 h-6 stroke-[1.5]" />
      case 7: return <ShieldCheck className="w-6 h-6 stroke-[1.5]" />
      case 8: return <Package className="w-6 h-6 stroke-[1.5]" />
      default: return <Box className="w-6 h-6 stroke-[1.5]" />
    }
  }

  return (
    <article>
      <PageHeader eyebrow={t.eyebrow} title={t.title} lead={t.lead} />

      {/* The Sequence Grid Section */}
      <section className="min-h-screen flex flex-col border-y border-border bg-card">
        {/* Header */}
        <div className="flex-none px-5 py-12 md:px-12 md:py-16 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="max-w-xl">
            <p className="font-subheading text-xs uppercase tracking-[0.3em] text-primary">
              THE SEQUENCE
            </p>
            <h2 className="mt-6 text-balance font-serif text-5xl font-light leading-[1.1] md:text-6xl lg:text-7xl">
              From concept<br />to creation.
            </h2>
          </div>
          <div className="max-w-xs flex flex-col items-start md:items-end text-left md:text-right gap-6">
            <p className="text-sm leading-relaxed text-muted-foreground">
              A nine-step journey where tradition meets innovation. Every detail matters, every step defines quality.
            </p>
            <button 
              onClick={() => document.getElementById('step-01')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex h-14 w-14 items-center justify-center rounded-full border border-border text-foreground transition-all hover:bg-border hover:scale-105 active:scale-95"
              aria-label="Scroll down to details"
            >
              <ArrowDown className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* 3x3 Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {t.steps.map((step, index) => (
            <button
              key={step.no}
              onClick={() => document.getElementById(`step-${step.no}`)?.scrollIntoView({ behavior: 'smooth' })}
              className={cn(
                "group relative flex flex-col p-8 md:p-10 text-left transition-colors hover:bg-muted/30 border-b border-border",
                (index % 3 !== 2) && "lg:border-r",
                (index % 2 === 0) && "md:border-r lg:border-r-0"
              )}
            >
              <div className="mb-16 text-muted-foreground group-hover:text-primary transition-colors">
                {getIcon(index)}
              </div>
              
              <div className="flex items-center gap-4 mb-5">
                <span className="font-serif text-5xl text-primary/90 tracking-tighter">
                  <span className="opacity-40">&middot;</span> {step.no}
                </span>
                <h3 className="font-subheading text-[10px] sm:text-xs tracking-[0.2em] uppercase leading-relaxed max-w-[120px]">
                  {step.title}
                </h3>
              </div>
              
              <p className="text-sm leading-relaxed text-muted-foreground/80 max-w-[280px]">
                {step.tagline}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-7xl px-5 md:px-8">
        {t.steps.map((step, i) => (
          <div
            key={step.no}
            id={`step-${step.no}`}
            className="grid scroll-mt-28 items-start gap-8 border-b border-border py-16 md:grid-cols-12 md:gap-12 md:py-24"
          >
            <div className="md:col-span-5">
              <div
                className={`relative aspect-[4/3] overflow-hidden rounded-sm ${
                  i % 2 === 1 ? 'md:order-last' : ''
                }`}
              >
                <Image
                  src={`/images/process-${i + 1}.png`}
                  alt={step.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col gap-5 md:col-span-7 md:pt-2">
              <div className="flex items-baseline gap-4">
                <span className="font-serif text-5xl font-light text-primary/40 md:text-6xl">
                  {step.no}
                </span>
                <span className="h-px flex-1 bg-border" aria-hidden />
              </div>
              <div>
                <h2 className="text-balance font-serif text-3xl font-light leading-tight md:text-4xl">
                  {step.title}
                </h2>
                <p className="mt-3 font-serif text-lg italic text-primary/80">
                  {step.tagline}
                </p>
              </div>
              <p className="max-w-2xl text-pretty leading-relaxed text-foreground/80">
                {step.body}
              </p>
              <div className="mt-2">
                <p className="font-subheading text-xs uppercase tracking-[0.28em] text-muted-foreground">
                  {t.valuesLabel}
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {step.values.map((v) => (
                    <li
                      key={v}
                      className="rounded-full border border-border px-3 py-1 text-xs tracking-wide text-foreground/70"
                    >
                      {v}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-5 py-24 text-center md:px-8 md:py-32">
        <p className="text-balance font-serif text-2xl font-light leading-snug md:text-4xl">
          {lang === 'es'
            ? 'Cada par es el resultado de nueve etapas de cuidado, técnica y oficio.'
            : 'Every pair is the result of nine stages of care, technique, and craft.'}
        </p>
        <Link
          href={routes.contact}
          className="mt-10 inline-block rounded-sm bg-foreground px-8 py-3 text-sm tracking-wide text-background transition-opacity hover:opacity-90"
        >
          {n.enquire}
        </Link>
      </section>

      <FloatingProcessNav steps={t.steps} />
    </article>
  )
}
