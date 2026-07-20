'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/components/language-provider'
import { nav, routes } from '@/lib/i18n'

export function SiteHeader() {
  const { lang, setLang } = useLanguage()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const t = nav[lang]
  const isTransparent = pathname === routes.home && !scrolled && !open
  const headerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    // Solo animar si estamos en la página de inicio
    if (pathname !== routes.home) return
    
    // Si ya se vio el intro en esta sesión, no animar
    if (sessionStorage.getItem('hasSeenLoader')) return

    const elements = gsap.utils.toArray('.nav-animate')
    
    // Ocultar elementos inicialmente
    gsap.set(elements, { y: -30, opacity: 0 })

    const playIntro = () => {
      gsap.to(elements, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.05,
        ease: 'power3.out'
      })
    }

    // Escuchar el evento que dispara el Loader
    window.addEventListener('introReady', playIntro)
    return () => window.removeEventListener('introReady', playIntro)
  }, { scope: headerRef, dependencies: [pathname] })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const links = [
    { href: routes.about, label: t.about },
    { href: routes.process, label: t.process },
    { href: routes.craft, label: t.craft },
    { href: routes.products, label: t.products },
    { href: routes.contact, label: t.contact },
  ]

  return (
    <header
      ref={headerRef}
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        !isTransparent
          ? 'border-b border-border bg-background/90 backdrop-blur-md text-foreground'
          : 'border-b border-transparent text-[#f3ede5]',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8">
        <Link
          href={routes.home}
          className="flex flex-col leading-none nav-animate"
          aria-label="Lyon's Artisans home"
        >
          <span className="font-serif text-xl tracking-tight md:text-2xl">
            Lyon&apos;s Artisans
          </span>
          <span className={cn(
            "font-subheading text-[10px] uppercase tracking-[0.32em] transition-colors",
            !isTransparent ? "text-muted-foreground" : "text-[#f3ede5]/70"
          )}>
            León · México
          </span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'nav-animate text-sm tracking-wide transition-colors',
                !isTransparent
                  ? 'text-foreground/70 hover:text-foreground'
                  : 'text-[#f3ede5]/70 hover:text-[#f3ede5]',
                pathname === link.href && (!isTransparent ? 'text-foreground' : 'text-[#f3ede5]'),
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="nav-animate">
            <LangToggle lang={lang} setLang={setLang} isDark={isTransparent} />
          </div>
          <Link
            href={routes.contact}
            className={cn(
              "nav-animate hidden rounded-sm border px-5 py-2 text-sm tracking-wide transition-colors md:inline-block",
              !isTransparent
                ? "border-foreground/20 hover:bg-foreground hover:text-background"
                : "border-[#f3ede5]/30 hover:bg-[#f3ede5] hover:text-[#1c1c1c]"
            )}
          >
            {t.enquire}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "nav-animate -mr-1 inline-flex size-9 items-center justify-center md:hidden transition-colors",
              !isTransparent ? "text-foreground" : "text-[#f3ede5]"
            )}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-background px-5 pb-8 pt-4 md:hidden">
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
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
  lang,
  setLang,
  isDark
}: {
  lang: 'en' | 'es'
  setLang: (l: 'en' | 'es') => void
  isDark?: boolean
}) {
  return (
    <div className={cn(
      "flex items-center text-xs tracking-widest transition-colors",
      isDark ? "text-[#f3ede5]/60" : "text-muted-foreground"
    )}>
      <button
        type="button"
        onClick={() => setLang('en')}
        className={cn(
          'px-1.5 transition-colors',
          isDark ? 'hover:text-[#f3ede5]' : 'hover:text-foreground',
          lang === 'en' && (isDark ? 'text-[#f3ede5]' : 'text-foreground'),
        )}
        aria-pressed={lang === 'en'}
      >
        EN
      </button>
      <span className={cn("transition-colors", isDark ? "text-[#f3ede5]/30" : "text-border")} aria-hidden>
        /
      </span>
      <button
        type="button"
        onClick={() => setLang('es')}
        className={cn(
          'px-1.5 transition-colors',
          isDark ? 'hover:text-[#f3ede5]' : 'hover:text-foreground',
          lang === 'es' && (isDark ? 'text-[#f3ede5]' : 'text-foreground'),
        )}
        aria-pressed={lang === 'es'}
      >
        ES
      </button>
    </div>
  )
}
