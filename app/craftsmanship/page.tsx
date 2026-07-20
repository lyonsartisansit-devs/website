'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/components/language-provider'
import { PageHeader } from '@/components/page-header'
import { craft, routes } from '@/lib/i18n'

export default function CraftsmanshipPage() {
  const { lang } = useLanguage()
  const t = craft[lang]

  return (
    <article>
      <PageHeader eyebrow={t.eyebrow} title={t.title} lead={t.lead} />

      <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8 md:pb-32">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
            <Image
              src="/images/craft-hero.png"
              alt="Craftsmanship"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center gap-6 text-lg leading-relaxed text-foreground/80 md:pl-8">
            {t.body.map((p) => (
              <p key={p.slice(0, 24)} className="text-pretty">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">
          <p className="font-subheading text-xs uppercase tracking-[0.3em] text-primary">
            {t.processLabel}
          </p>
          <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-10">
            {t.process.map((step) => (
              <div key={step.no} className="flex flex-col gap-4">
                <span className="font-serif text-5xl font-light text-primary/40">
                  {step.no}
                </span>
                <h2 className="font-serif text-2xl">{step.title}</h2>
                <p className="leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
          <Link
            href={routes.process}
            className="mt-14 inline-flex items-center gap-2 border-b border-foreground/30 pb-1 text-sm tracking-wide transition-colors hover:border-foreground"
          >
            {lang === 'es'
              ? 'Explorar las 9 etapas de nuestro proceso'
              : 'Explore the 9 stages of our process'}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-24 text-center md:px-8 md:py-32">
        <p className="text-balance font-serif text-2xl font-light italic leading-snug md:text-4xl">
          {t.peopleQuote}
        </p>
      </section>
    </article>
  )
}
