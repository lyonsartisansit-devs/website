'use client'

import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/routing'

export function SiteFooter() {
  const tFooter = useTranslations('footer')
  const tNav = useTranslations('nav')
  const pathname = usePathname()

  const isComingSoon =
    process.env.NEXT_PUBLIC_COMING_SOON === 'true' ||
    process.env.COMING_SOON === 'true' ||
    pathname.includes('/coming-soon') ||
    pathname.includes('/under-construction')

  if (isComingSoon) {
    return null
  }

  const year = new Date().getFullYear()

  const links = [
    { href: '/who-we-are', label: tNav('about') },
    { href: '/process', label: tNav('process') },
    { href: '/craftsmanship', label: tNav('craft') },
    { href: '/collections', label: tNav('products') },
    { href: '/contact', label: tNav('contact') },
  ]

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="font-serif text-3xl leading-tight">Lyon&apos;s Artisans</p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {tFooter('tagline')}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <p className="font-subheading text-xs uppercase tracking-[0.28em] text-muted-foreground">
              {tFooter('explore')}
            </p>
            <ul className="flex flex-col gap-3">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href as any}
                    className="text-sm text-foreground/75 transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <p className="font-subheading text-xs uppercase tracking-[0.28em] text-muted-foreground">
              León, Guanajuato
            </p>
            <p className="text-sm text-foreground/75">México</p>
            <a
              href="mailto:hello@lyonsartisans.mx"
              className="text-sm text-foreground/75 transition-colors hover:text-foreground"
            >
              hello@lyonsartisans.mx
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-border pt-6 text-xs tracking-wide text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            © {year} Lyon&apos;s Artisans. {tFooter('rights')}
          </p>
          <p className="font-subheading uppercase tracking-[0.28em]">
            {tFooter('atelierTagline')}
          </p>
        </div>
      </div>
    </footer>
  )
}
