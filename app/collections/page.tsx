'use client'

import Image from 'next/image'
import { useLanguage } from '@/components/language-provider'
import { PageHeader } from '@/components/page-header'
import { products } from '@/lib/i18n'

export default function CollectionsPage() {
  const { lang } = useLanguage()
  const t = products[lang]

  return (
    <article>
      <PageHeader eyebrow={t.eyebrow} title={t.title} lead={t.lead} />

      <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8 md:pb-32">
        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {t.items.map((item, i) => {
            const images = [
              '/images/collection-dress.png',
              '/images/collection-loafers.png',
              '/images/collection-sneakers.png',
              '/images/collection-boots.png',
              '/images/collection-accessories.png',
              '/images/collection-bespoke.png'
            ]
            
            return (
            <article key={item.name} className="group flex flex-col">
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-muted">
                <Image
                  src={images[i] || `/placeholder.svg?height=1000&width=800&query=premium%20leather%20footwear%20${i + 1}`}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h2 className="mt-5 font-serif text-2xl">{item.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </article>
            )
          })}
        </div>

        <p className="mt-20 max-w-2xl border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground">
          {t.note}
        </p>
      </section>
    </article>
  )
}
