'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/components/language-provider'
import { PageHeader } from '@/components/page-header'
import { process, routes, nav } from '@/lib/i18n'

export default function ProcessPage() {
  const { lang } = useLanguage()
  const t = process[lang]
  const n = nav[lang]

  return (
    <article>
      <PageHeader eyebrow={t.eyebrow} title={t.title} lead={t.lead} />

      {/* Index strip */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-12">
          <p className="font-subheading text-xs uppercase tracking-[0.3em] text-primary">
            {t.stepsLabel}
          </p>
          <ol className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-3">
            {t.steps.map((step) => (
              <li key={step.no}>
                <a
                  href={`#step-${step.no}`}
                  className="group flex items-baseline gap-3 text-sm text-foreground/70 transition-colors hover:text-foreground"
                >
                  <span className="font-serif text-base text-primary/60">
                    {step.no}
                  </span>
                  <span className="leading-snug">{step.title}</span>
                </a>
              </li>
            ))}
          </ol>
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
    </article>
  )
}
