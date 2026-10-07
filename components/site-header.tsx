'use client'

import { useEffect, useState, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link, usePathname, useRouter, type Locale } from '@/i18n/routing'
import { Menu, X } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { cn } from '@/lib/utils'
import { useTranslationsContext } from '@/components/translations-provider'

export function SiteHeader() {
  const t = useTranslations('nav')
  const locale = useLocale() as Locale
  const pathname = usePathname()
  const router = useRouter()
  const { translations } = useTranslationsContext()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const isComingSoon =
    process.env.NEXT_PUBLIC_COMING_SOON === 'true' ||
    process.env.COMING_SOON === 'true' ||
    pathname.includes('/coming-soon') ||
    pathname.includes('/under-construction')

  if (isComingSoon) {
    return null
  }

  const isHome = pathname === '/' || pathname === ''
  const isTransparent = isHome && !scrolled && !open
  const headerRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      // Only animate on home page
      if (!isHome) return

      // If intro already seen in this session, skip animation
      if (typeof window !== 'undefined' && sessionStorage.getItem('hasSeenLoader')) return

      const elements = gsap.utils.toArray('.nav-animate')

      // Initially hide elements
      gsap.set(elements, { y: -30, opacity: 0 })

      const playIntro = () => {
        gsap.to(elements, {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.05,
          ease: 'power3.out',
        })
      }

      window.addEventListener('introReady', playIntro)
      return () => window.removeEventListener('introReady', playIntro)
    },
    { scope: headerRef, dependencies: [pathname] }
  )

  useEffect(() => {
    const onScroll = () => {
      if (isHome) {
        setScrolled(window.scrollY > window.innerHeight - 50)
      } else {
        setScrolled(window.scrollY > 16)
      }
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const links = [
    { href: '/who-we-are', label: t('about') },
    { href: '/process', label: t('process') },
    { href: '/craftsmanship', label: t('craft') },
    { href: '/collections', label: t('products') },
    { href: '/journal', label: t('blog') },
    { href: '/contact', label: t('contact') },
  ]

  const handleLanguageChange = (targetLocale: Locale) => {
    if (targetLocale === locale) return

    // Detail page logic: pathname is /journal/[slug]
    const isJournalDetail = pathname.startsWith('/journal/') && pathname !== '/journal'
    if (isJournalDetail) {
      const translation = translations?.find((tr) => tr.locale === targetLocale)
      if (translation && translation.slug) {
        window.location.href = `/${targetLocale}/journal/${translation.slug}`
      } else {
        // Fallback to journal listing if no translation exists
        window.location.href = `/${targetLocale}/journal`
      }
      return
    }

    // Listing page logic: pathname is /journal (drop ?category= query)
    if (pathname === '/journal') {
      window.location.href = `/${targetLocale}/journal`
      return
    }

    // Standard pages: switch locale on current pathname
    router.replace(pathname as any, { locale: targetLocale })
  }

  return (
    <header
      ref={headerRef}
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        !isTransparent
          ? 'border-b border-border bg-background/90 backdrop-blur-md text-foreground'
          : 'border-b border-transparent text-[#f3ede5]'
      )}
    >
      <div className="w-full grid h-16 grid-cols-[1fr_auto_1fr] items-center px-4 md:h-20 md:px-8">
        {/* Left - Navigation Links */}
        <div className="flex w-full justify-start items-center">
          {/* Desktop Nav */}
          <nav className="hidden items-center justify-start gap-6 lg:gap-10 md:flex">
            {links.slice(0, 4).map((link) => (
              <Link
                key={link.href}
                href={link.href as any}
                className={cn(
                  'nav-animate text-[11px] uppercase tracking-[0.15em] transition-colors',
                  !isTransparent
                    ? 'text-foreground/70 hover:text-foreground'
                    : 'text-[#f3ede5]/70 hover:text-[#f3ede5]',
                  pathname === link.href &&
                    (!isTransparent ? 'text-foreground' : 'text-[#f3ede5]')
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              'nav-animate inline-flex size-9 items-center justify-start md:hidden transition-colors cursor-pointer',
              !isTransparent ? 'text-foreground' : 'text-[#f3ede5]'
            )}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {/* Center - Logo */}
        <div className="flex justify-center px-4">
          <Link
            href="/"
            className="flex flex-col items-center justify-center leading-none nav-animate h-full"
            aria-label="Lyon's Artisans home"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={isTransparent ? '/logo-STONE.svg' : '/logo-noir-2.svg'}
              alt="Lyon's Artisans"
              className="h-16 md:h-20 w-auto max-w-[232px] object-contain transition-all duration-300"
            />
          </Link>
        </div>

        {/* Right - Utilities & Secondary Nav */}
        <div className="flex w-full items-center justify-end">
          <nav className="hidden items-center justify-end gap-6 lg:gap-10 md:flex">
            {links.slice(4, 6).map((link) => (
              <Link
                key={link.href}
                href={link.href as any}
                className={cn(
                  'nav-animate text-[11px] uppercase tracking-[0.15em] transition-colors',
                  !isTransparent
                    ? 'text-foreground/70 hover:text-foreground'
                    : 'text-[#f3ede5]/70 hover:text-[#f3ede5]',
                  pathname === link.href &&
                    (!isTransparent ? 'text-foreground' : 'text-[#f3ede5]')
                )}
              >
                {link.label}
              </Link>
            ))}

            <div className="nav-animate flex items-center">
              <LangToggle
                currentLocale={locale}
                onSelectLocale={handleLanguageChange}
                isDark={isTransparent}
              />
            </div>

            <Link
              href="/contact"
              className={cn(
                'nav-animate text-[11px] uppercase tracking-[0.15em] transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-current after:transition-transform hover:after:origin-bottom-left hover:after:scale-x-100',
                !isTransparent
                  ? 'text-foreground/70 hover:text-foreground'
                  : 'text-[#f3ede5]/70 hover:text-[#f3ede5]'
              )}
            >
              {t('enquire')}
            </Link>
          </nav>

          {/* Mobile Lang Toggle */}
          <div className="nav-animate md:hidden ml-auto">
            <LangToggle
              currentLocale={locale}
              onSelectLocale={handleLanguageChange}
              isDark={isTransparent}
            />
          </div>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-background px-5 pb-8 pt-4 md:hidden">
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href as any}
                  className="block border-b border-border/60 py-4 font-serif text-2xl"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}

function LangToggle({
  currentLocale,
  onSelectLocale,
  isDark,
}: {
  currentLocale: Locale
  onSelectLocale: (locale: Locale) => void
  isDark?: boolean
}) {
  return (
    <div
      className={cn(
        'flex items-center text-xs tracking-widest transition-colors',
        isDark ? 'text-[#f3ede5]/60' : 'text-muted-foreground'
      )}
    >
      <button
        type="button"
        onClick={() => onSelectLocale('en')}
        className={cn(
          'px-1.5 transition-colors cursor-pointer',
          isDark ? 'hover:text-[#f3ede5]' : 'hover:text-foreground',
          currentLocale === 'en' && (isDark ? 'text-[#f3ede5] font-semibold' : 'text-foreground font-semibold')
        )}
        aria-pressed={currentLocale === 'en'}
      >
        EN
      </button>
      <span
        className={cn('transition-colors', isDark ? 'text-[#f3ede5]/30' : 'text-border')}
        aria-hidden
      >
        /
      </span>
      <button
        type="button"
        onClick={() => onSelectLocale('es')}
        className={cn(
          'px-1.5 transition-colors cursor-pointer',
          isDark ? 'hover:text-[#f3ede5]' : 'hover:text-foreground',
          currentLocale === 'es' && (isDark ? 'text-[#f3ede5] font-semibold' : 'text-foreground font-semibold')
        )}
        aria-pressed={currentLocale === 'es'}
      >
        ES
      </button>
    </div>
  )
}
