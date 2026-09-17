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

  const isComingSoon =
    process.env.NEXT_PUBLIC_COMING_SOON === 'true' ||
    process.env.COMING_SOON === 'true' ||
    pathname === '/coming-soon' ||
    pathname === '/under-construction'

  if (isComingSoon) {
    return null
  }



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
    const onScroll = () => {
      if (pathname === routes.home) {
        // On home page, wait until reaching the next section (approx 100vh)
        setScrolled(window.scrollY > window.innerHeight - 50)
      } else {
        // On other pages, change color almost immediately
        setScrolled(window.scrollY > 16)
      }
    }
    
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const links = [
    { href: routes.about, label: t.about },
    { href: routes.process, label: t.process },
    { href: routes.craft, label: t.craft },
    { href: routes.products, label: t.products },
    { href: routes.blog, label: t.blog },
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
      <div className="w-full grid h-16 grid-cols-[1fr_auto_1fr] items-center px-4 md:h-20 md:px-8">
        
        {/* Left - Navigation Links */}
        <div className="flex w-full justify-start items-center">
          {/* Desktop Nav */}
          <nav className="hidden items-center justify-start gap-6 lg:gap-10 md:flex">
            {links.slice(0, 4).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'nav-animate text-[11px] uppercase tracking-[0.15em] transition-colors',
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
          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "nav-animate inline-flex size-9 items-center justify-start md:hidden transition-colors",
              !isTransparent ? "text-foreground" : "text-[#f3ede5]"
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
            href={routes.home}
            className="flex flex-col items-center justify-center leading-none nav-animate h-full"
            aria-label="Lyon's Artisans home"
          >
            <img 
              src={isTransparent ? "/logo-STONE.svg" : "/logo-noir-2.svg"}
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
                href={link.href}
                className={cn(
                  'nav-animate text-[11px] uppercase tracking-[0.15em] transition-colors',
                  !isTransparent
                    ? 'text-foreground/70 hover:text-foreground'
                    : 'text-[#f3ede5]/70 hover:text-[#f3ede5]',
                  pathname === link.href && (!isTransparent ? 'text-foreground' : 'text-[#f3ede5]'),
                )}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="nav-animate flex items-center">
              <LangToggle lang={lang} setLang={setLang} isDark={isTransparent} />
            </div>
            
            <Link
              href={routes.contact}
              className={cn(
                "nav-animate text-[11px] uppercase tracking-[0.15em] transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-current after:transition-transform hover:after:origin-bottom-left hover:after:scale-x-100",
                !isTransparent
                  ? "text-foreground/70 hover:text-foreground"
                  : "text-[#f3ede5]/70 hover:text-[#f3ede5]"
              )}
            >
              {t.enquire}
            </Link>
          </nav>
          
          {/* Mobile Lang Toggle */}
          <div className="nav-animate md:hidden ml-auto">
            <LangToggle lang={lang} setLang={setLang} isDark={isTransparent} />
          </div>
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
