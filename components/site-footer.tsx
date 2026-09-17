'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/components/language-provider'
import { footer, nav, routes } from '@/lib/i18n'


export function SiteFooter() {
  const { lang } = useLanguage()
  const pathname = usePathname()

  const isComingSoon =
    process.env.NEXT_PUBLIC_COMING_SOON === 'true' ||
    process.env.COMING_SOON === 'true' ||
    pathname === '/coming-soon' ||
    pathname === '/under-construction'

  if (isComingSoon) {
    return null
  }



  const f = footer[lang]
  const n = nav[lang]
  const year = new Date().getFullYear()

  const links = [
    { href: routes.about, label: n.about },
    { href: routes.process, label: n.process },
    { href: routes.craft, label: n.craft },
    { href: routes.products, label: n.products },
    { href: routes.contact, label: n.contact },
  ]

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="font-serif text-3xl leading-tight">Lyon&apos;s Artisans</p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {f.tagline}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <p className="font-subheading text-xs uppercase tracking-[0.28em] text-muted-foreground">
              {f.explore}
            </p>
            <ul className="flex flex-col gap-3">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
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
            © {year} Lyon&apos;s Artisans. {f.rights}
          </p>
          <p className="font-subheading uppercase tracking-[0.28em]">
            Human Hands · Refined Machinery · Premium Materials
          </p>
        </div>
      </div>
    </footer>
  )
}
