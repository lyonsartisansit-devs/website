'use client'

import { useEffect, useState, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link, usePathname, useRouter, type Locale } from '@/i18n/routing'
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
  const headerRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  const isComingSoon =
    process.env.NEXT_PUBLIC_COMING_SOON === 'true' ||
    process.env.COMING_SOON === 'true' ||
    pathname.includes('/coming-soon') ||
    pathname.includes('/under-construction')

  const isHome = pathname === '/' || pathname === ''
  // When mobile menu is open, force solid background for continuous curtain effect
  const isTransparent = isHome && !scrolled && !open

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

  // Close menu on route change
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Close menu on resize to >= 980px
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 980px)')
    const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        setOpen(false)
      }
    }

    mql.addEventListener('change', handleMediaChange)
    return () => mql.removeEventListener('change', handleMediaChange)
  }, [])

  // Keyboard accessibility: ESC key closes menu and focuses toggle button
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open])

  // Lock scroll while mobile menu is open
  useEffect(() => {
    if (open) {
      const originalOverflow = document.documentElement.style.overflow
      document.documentElement.style.overflow = 'hidden'
      return () => {
        document.documentElement.style.overflow = originalOverflow
      }
    }
  }, [open])

  // Safety scroll restoration on unmount
  useEffect(() => {
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [])

  if (isComingSoon) {
    return null
  }

  // Single source of truth for all links
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

    setOpen(false)

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

  const emailAddress = locale === 'es' ? 'hola@lyonsartisans.mx' : 'hello@lyonsartisans.mx'
  const toggleLabel = open ? t('closeMenu') : t('openMenu')

  return (
    <header
      ref={headerRef}
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        open
          ? 'bg-[#f4eee8] text-[#26272a]'
          : !isTransparent
            ? 'border-b border-border bg-background/90 backdrop-blur-md text-foreground'
            : 'border-b border-transparent text-[#f3ede5]'
      )}
    >
      {/* ========================================================================= */}
      {/* 1. MOBILE NAVBAR BAR (< 980px: 64px height, Logo Left, Toggle Right)       */}
      {/* ========================================================================= */}
      <div className="flex h-16 w-full items-center justify-between px-5 min-[980px]:hidden">
        {/* Left: Brand Logo */}
        <Link
          href="/"
          className="flex items-center h-full"
          aria-label="Lyon's Artisans home"
          onClick={() => setOpen(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={isTransparent ? '/logo-STONE.svg' : '/logo-noir-2.svg'}
            alt="Lyon's Artisans"
            className="h-10 sm:h-12 w-auto max-w-[180px] sm:max-w-[200px] object-contain transition-all duration-300"
          />
        </Link>

        {/* Right: Hamburger Button (44x44px touch target) */}
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="nav__toggle"
          aria-label={toggleLabel}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <span />
          <span />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 2. DESKTOP NAVBAR (≥ 980px: 80px height, 3-Column Layout)                  */}
      {/* ========================================================================= */}
      <div className="hidden w-full h-20 grid-cols-[1fr_auto_1fr] items-center px-4 md:px-8 min-[980px]:grid">
        {/* Left - Navigation Links (First 4 links) */}
        <div className="flex w-full justify-start items-center">
          <nav className="flex items-center justify-start gap-6 lg:gap-10">
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
                    (!isTransparent ? 'text-foreground font-semibold' : 'text-[#f3ede5] font-semibold')
                )}
                aria-current={pathname === link.href ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Center - Centered Logo */}
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
          <nav className="flex items-center justify-end gap-6 lg:gap-10">
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
                    (!isTransparent ? 'text-foreground font-semibold' : 'text-[#f3ede5] font-semibold')
                )}
                aria-current={pathname === link.href ? 'page' : undefined}
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
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MOBILE MENU PANEL (< 980px Curtain Panel with Masked Links)             */}
      {/* ========================================================================= */}
      <div
        id="mobile-menu"
        className={cn('menu', open && 'is-open')}
      >
        {/* Main Links (First 5 links) */}
        <ul className="menu__list">
          {links.slice(0, 5).map((link, index) => {
            const isCurrent = pathname === link.href
            return (
              <li key={link.href} style={{ '--i': index } as React.CSSProperties}>
                <Link
                  href={link.href as any}
                  className="menu__link"
                  aria-current={isCurrent ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Footer: Language Switcher, Email & Full Width Solid Contact CTA */}
        <div className="menu__foot">
          <div className="menu__row">
            {/* Language Switcher */}
            <div className="flex items-center text-xs tracking-widest text-[#6b6762]">
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={cn(
                  'px-1.5 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26272a]',
                  locale === 'en'
                    ? 'text-[#26272a] font-bold underline underline-offset-4'
                    : 'text-[#6b6762] hover:text-[#26272a]'
                )}
                aria-pressed={locale === 'en'}
              >
                EN
              </button>
              <span className="text-[#dcd5ca]">/</span>
              <button
                type="button"
                onClick={() => handleLanguageChange('es')}
                className={cn(
                  'px-1.5 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#26272a]',
                  locale === 'es'
                    ? 'text-[#26272a] font-bold underline underline-offset-4'
                    : 'text-[#6b6762] hover:text-[#26272a]'
                )}
                aria-pressed={locale === 'es'}
              >
                ES
              </button>
            </div>

            {/* Email Link */}
            <a
              href={`mailto:${emailAddress}`}
              className="menu__mail"
            >
              {emailAddress}
            </a>
          </div>

          {/* Full-width Solid Contact CTA */}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="menu__cta"
          >
            {t('enquire')}
          </Link>
        </div>
      </div>
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
          'px-1.5 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-current',
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
          'px-1.5 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-current',
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
