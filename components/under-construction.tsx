'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight, X, Check } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useLanguage } from '@/components/language-provider';

export function UnderConstruction() {
  const { lang, setLang } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [circleOrigin, setCircleOrigin] = useState({ x: 0, y: 0 });
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  const content = {
    en: {
      status: 'A NEW HOME IS TAKING SHAPE',
      requestFirstLook: 'REQUEST THE FIRST LOOK',
      eyebrow: 'LEÓN, MÉXICO · EST. MANUFACTURE',
      titleLine1: 'A new',
      titleLine2: 'standard.',
      subtitle: 'Premium footwear and leather goods, made by hand in one of the world\'s great shoemaking capitals.',
      startConversation: 'START A CONVERSATION',
      getTheFirstLook: 'GET THE FIRST LOOK',
      modalTag: '02 / THE INVITATION',
      modalTitle: 'Stay close.',
      modalSubtitle: 'Leave your email for the first collection reveal, studio notes, and a direct line to the house in León.',
      modalFormTitle: 'Request the first look',
      modalFormLabel: 'BUSINESS EMAIL',
      modalPlaceholder: 'you@company.com',
      modalKeepMeClose: 'KEEP ME CLOSE',
      modalSending: 'SENDING...',
      modalMicrocopy: 'One thoughtful update. No noise.',
      modalSubmittedTitle: 'You are on the list.',
      modalSubmittedText: 'Thank you. We will share the first collection reveal and private studio notes directly with you.',
      modalDarkLeft1: 'LEÓN, GUANAJUATO',
      modalDarkLeft2: 'MÉXICO · 2026',
      modalDarkRightTitle: 'START A CONVERSATION',
      close: 'CLOSE',
    },
    es: {
      status: 'UN NUEVO HOGAR TOMA FORMA',
      requestFirstLook: 'SOLICITAR PRIMER VISTAZO',
      eyebrow: 'LEÓN, MÉXICO · MANUFACTURA EST.',
      titleLine1: 'Un nuevo',
      titleLine2: 'estándar.',
      subtitle: 'Calzado y artículos de piel premium, hechos a mano en una de las grandes capitales zapateras del mundo.',
      startConversation: 'INICIAR CONVERSACIÓN',
      getTheFirstLook: 'PRIMER VISTAZO',
      modalTag: '02 / LA INVITACIÓN',
      modalTitle: 'Mantente cerca.',
      modalSubtitle: 'Deja tu correo para la revelación de la primera colección, notas de estudio y una línea directa con la casa en León.',
      modalFormTitle: 'Solicita el primer vistazo',
      modalFormLabel: 'CORREO INSTITUCIONAL',
      modalPlaceholder: 'tu@empresa.com',
      modalKeepMeClose: 'MANTENME CERCA',
      modalSending: 'ENVIANDO...',
      modalMicrocopy: 'Una actualización pensada. Sin ruido.',
      modalSubmittedTitle: 'Estás en la lista.',
      modalSubmittedText: 'Gracias. Compartiremos la revelación de la primera colección y notas privadas del estudio directamente contigo.',
      modalDarkLeft1: 'LEÓN, GUANAJUATO',
      modalDarkLeft2: 'MÉXICO · 2026',
      modalDarkRightTitle: 'INICIAR CONVERSACIÓN',
      close: 'CERRAR',
    }
  };

  const t = content[lang];

  // Keyboard shortcut ESC to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const handleOpenModal = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    setCircleOrigin({ x, y });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (!modalRef.current) return;
    
    // Animate radial circle shrinking back to click origin
    gsap.to(modalRef.current, {
      clipPath: `circle(0px at ${circleOrigin.x}px ${circleOrigin.y}px)`,
      opacity: 0,
      duration: 0.75,
      ease: 'power3.inOut',
      onComplete: () => {
        setIsModalOpen(false);
      }
    });
  };

  useGSAP(() => {
    if (isModalOpen && modalRef.current) {
      // 1. Radial expand animation
      gsap.fromTo(
        modalRef.current,
        {
          clipPath: `circle(0px at ${circleOrigin.x}px ${circleOrigin.y}px)`,
          opacity: 1,
        },
        {
          clipPath: `circle(160vmax at ${circleOrigin.x}px ${circleOrigin.y}px)`,
          duration: 0.85,
          ease: 'power3.inOut',
        }
      );

      // 2. Stagger content elements inside modal
      if (modalContentRef.current) {
        const elements = modalContentRef.current.querySelectorAll('.modal-anim');
        gsap.fromTo(
          elements,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power2.out',
            delay: 0.2,
          }
        );
      }
    }
  }, { dependencies: [isModalOpen] });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0D0B09] text-[#F3EFE7] font-sans overflow-x-hidden selection:bg-[#C9B6A3] selection:text-[#191512]">
      {/* ========================================================================= */}
      {/* ALWAYS VISIBLE FLOATING BUBBLE LANGUAGE SWITCHER (Bottom-Right Corner)   */}
      {/* ========================================================================= */}
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[60] flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-white/20 bg-black/45 backdrop-blur-md text-xs tracking-widest text-[#EBE4D8] shadow-2xl transition-all duration-300 hover:bg-black/65 hover:border-white/40 hover:scale-105">
        <button
          type="button"
          onClick={() => setLang('en')}
          className={`px-1.5 transition-colors hover:text-white cursor-pointer ${
            lang === 'en' ? 'text-white font-bold underline underline-offset-4' : 'text-[#EBE4D8]/60'
          }`}
          aria-label="Switch to English"
        >
          EN
        </button>
        <span className="text-[#EBE4D8]/30">/</span>
        <button
          type="button"
          onClick={() => setLang('es')}
          className={`px-1.5 transition-colors hover:text-white cursor-pointer ${
            lang === 'es' ? 'text-white font-bold underline underline-offset-4' : 'text-[#EBE4D8]/60'
          }`}
          aria-label="Cambiar a Español"
        >
          ES
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. HERO UNDER CONSTRUCTION PAGE (Image 2 Replica)                        */}
      {/* ========================================================================= */}
      
      {/* Background Image & Overlays */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Main Background Image */}
        <img
          src="/images/hero.png"
          alt="Artisan shoe making in León, Mexico"
          className="h-full w-full object-cover object-center scale-105 transition-transform duration-1000"
        />

        {/* Dark Gradients for contrast and vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0807] via-[#0A0807]/50 to-[#0A0807]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0807]/90 via-[#0A0807]/45 to-transparent" />
        <div className="absolute inset-0 bg-black/25 backdrop-brightness-90" />

        {/* Circular Geometric Arc Overlay (Golden contours matching Image 2) */}
        <svg
          className="absolute right-0 bottom-0 top-0 h-full w-full pointer-events-none opacity-40 md:opacity-60"
          viewBox="0 0 1000 1000"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="700" cy="550" r="180" stroke="url(#goldLine)" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="700" cy="550" r="280" stroke="url(#goldLine)" strokeWidth="1" />
          <circle cx="700" cy="550" r="390" stroke="url(#goldLine)" strokeWidth="1.5" opacity="0.8" />
          <circle cx="700" cy="550" r="510" stroke="url(#goldLine)" strokeWidth="1" strokeDasharray="8 6" />
          <circle cx="700" cy="550" r="640" stroke="url(#goldLine)" strokeWidth="1" opacity="0.5" />
          <defs>
            <linearGradient id="goldLine" x1="200" y1="200" x2="900" y2="900" gradientUnits="userSpaceOnUse">
              <stop stopColor="#E4D9CA" stopOpacity="0.8" />
              <stop offset="0.5" stopColor="#B5926F" stopOpacity="0.5" />
              <stop offset="1" stopColor="#6D4835" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Top Header Bar (Uncluttered & Clean) */}
      <header className="relative z-20 w-full px-6 py-6 md:px-12 md:py-8 flex items-center justify-between">
        {/* Left: Logo Brand Image */}
        <Link href="/" className="flex items-center gap-4 group" aria-label="Lyon's Artisans home">
          <img
            src="/logo-STONE.svg"
            alt="Lyon's Artisans"
            className="h-10 sm:h-12 md:h-14 w-auto max-w-[180px] sm:max-w-[220px] md:max-w-[250px] object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>


        {/* Center: Status Badge */}
        <div className="hidden md:flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-black/20 backdrop-blur-md">
          <span className="size-2 rounded-full bg-[#C9B6A3] animate-pulse" />
          <span className="text-[11px] uppercase tracking-[0.22em] text-[#EBE4D8]/90 font-medium">
            {t.status}
          </span>
        </div>

        {/* Right: Action Link */}
        <button
          onClick={handleOpenModal}
          className="group flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] font-medium text-[#EBE4D8] hover:text-white transition-colors cursor-pointer"
        >
          <span>{t.requestFirstLook}</span>
          <ArrowUpRight className="size-4 text-[#C9B6A3] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </button>
      </header>

      {/* Main Hero Content */}
      <main className="relative z-10 flex min-h-[calc(100vh-100px)] flex-col justify-end px-6 pb-16 pt-20 md:px-16 md:pb-24 lg:pb-28">
        <div className="max-w-4xl">
          {/* Eyebrow / Tagline */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs uppercase tracking-[0.28em] text-[#C4B7A6] font-medium">
              {t.eyebrow}
            </span>
            <div className="h-[1px] w-12 bg-[#C4B7A6]/40 inline-block" />
          </div>

          {/* Headline */}
          <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-[9.5rem] font-normal tracking-tight text-[#F3EFE7] leading-[0.92] mb-8">
            {t.titleLine1}<br />
            {t.titleLine2}
          </h1>

          {/* Subtitle Paragraph */}
          <p className="max-w-xl text-base sm:text-lg md:text-xl text-[#C9BFB5] font-light leading-relaxed mb-10">
            {t.subtitle}
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {/* Primary Button */}
            <a
              href="mailto:hello@lyonsartisans.mx"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#EBE4D8] px-8 py-4 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#191512] transition-all duration-300 hover:bg-white hover:scale-[1.03] active:scale-[0.98] shadow-2xl"
            >
              <span>{t.startConversation}</span>
              <ArrowUpRight className="size-4 text-[#191512] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>

            {/* Secondary Button */}
            <button
              onClick={handleOpenModal}
              className="group inline-flex items-center justify-center rounded-full border border-white/30 bg-black/20 backdrop-blur-md px-8 py-4 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#F3EFE7] transition-all duration-300 hover:bg-white/10 hover:border-white/60 hover:scale-[1.03] active:scale-[0.98] cursor-pointer shadow-2xl"
            >
              <span>{t.getTheFirstLook}</span>
            </button>
          </div>
        </div>
      </main>

      {/* Mobile Status Dot Indicator (Visible only on small screens) */}
      <div className="md:hidden relative z-10 px-6 pb-8 flex items-center gap-2">
        <span className="size-2 rounded-full bg-[#C9B6A3] animate-pulse" />
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#EBE4D8]/80 font-medium">
          {t.status}
        </span>
      </div>

      {/* ========================================================================= */}
      {/* 2. CIRCULAR REVEAL MODAL ("Stay close." / "The Invitation" - Image 1)    */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div
          ref={modalRef}
          className="fixed inset-0 z-50 overflow-y-auto bg-[#F3EFE7] text-[#191512] flex flex-col justify-between"
          style={{
            willChange: 'clip-path',
          }}
        >
          {/* Inner Content Wrapper */}
          <div ref={modalContentRef} className="relative w-full min-h-screen flex flex-col justify-between">
            {/* Top Navigation inside Modal */}
            <div className="w-full px-6 py-6 md:px-12 md:py-8 flex items-center justify-between border-b border-[#D8CDBE]/60">
              <div className="modal-anim flex items-center gap-3">
                <svg width="24" height="28" viewBox="0 0 54 66" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#191512]">
                  <path d="M12 4V58H32V50H20V4H12Z" fill="currentColor"/>
                  <path d="M38 4L22 58H31L47 4H38Z" fill="currentColor"/>
                  <path d="M28 36H48V44H28V36Z" fill="currentColor"/>
                </svg>
                <div className="h-6 w-[1px] bg-[#191512]/30" />
                <span className="font-serif text-xs tracking-[0.25em] text-[#191512] uppercase font-semibold">LYON&apos;S ARTISANS</span>
              </div>

              {/* Close Modal Button */}
              <button
                onClick={handleCloseModal}
                className="modal-anim group flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-[#191512] hover:text-[#6D4835] transition-colors cursor-pointer px-4 py-2 rounded-full border border-[#191512]/20 hover:border-[#191512]"
                aria-label="Close invitation modal"
              >
                <span>{t.close}</span>
                <X className="size-4 transition-transform duration-300 group-hover:rotate-90" />
              </button>
            </div>

            {/* Main Modal Body */}
            <div className="w-full mx-auto max-w-7xl px-6 py-8 md:px-12 md:py-12 my-auto flex-1 flex flex-col justify-center">
              {/* Section Number Tag */}
              <p className="modal-anim text-xs uppercase tracking-[0.25em] text-[#918170] font-semibold mb-8 md:mb-12">
                {t.modalTag}
              </p>

              {/* Two Column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                {/* Left Column: Stay Close Heading & Subtitle */}
                <div className="lg:col-span-6 space-y-6">
                  <h2 className="modal-anim font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[7.5rem] font-normal text-[#191512] leading-[0.95] tracking-tight">
                    {t.modalTitle}
                  </h2>
                  <p className="modal-anim text-base sm:text-lg md:text-xl text-[#524940] font-light leading-relaxed max-w-md pt-2">
                    {t.modalSubtitle}
                  </p>
                </div>

                {/* Right Column: Request the First Look Form */}
                <div className="lg:col-span-6 pt-2 lg:pt-6 lg:pl-12">
                  <h3 className="modal-anim font-serif text-2xl sm:text-3xl md:text-4xl text-[#191512] font-normal mb-8">
                    {t.modalFormTitle}
                  </h3>

                  {!submitted ? (
                    <form onSubmit={handleSubmit} className="modal-anim space-y-4">
                      <label className="block text-[11px] font-bold tracking-[0.2em] uppercase text-[#736555]">
                        {t.modalFormLabel}
                      </label>

                      <div className="relative flex items-center border-b border-[#A69988] pb-3 pt-1 transition-colors duration-300 focus-within:border-[#191512]">
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={t.modalPlaceholder}
                          className="w-full bg-transparent text-base sm:text-lg text-[#191512] placeholder-[#9E9182] outline-none font-light"
                        />
                        <button
                          type="submit"
                          disabled={loading}
                          className="group inline-flex items-center gap-2 text-xs sm:text-sm font-bold tracking-[0.18em] uppercase text-[#191512] hover:text-[#6D4835] transition-colors whitespace-nowrap cursor-pointer ml-4"
                        >
                          <span>{loading ? t.modalSending : t.modalKeepMeClose}</span>
                          <ArrowRight className="size-4 text-[#191512] transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
                      </div>

                      <p className="text-xs text-[#736555] font-light pt-2">
                        {t.modalMicrocopy}
                      </p>
                    </form>
                  ) : (
                    <div className="modal-anim p-6 sm:p-8 rounded-lg bg-[#EAE0D3] border border-[#CFC1B0] space-y-3">
                      <div className="flex items-center gap-3 text-[#191512]">
                        <div className="size-8 rounded-full bg-[#191512] text-[#F3EFE7] flex items-center justify-center">
                          <Check className="size-5" />
                        </div>
                        <h4 className="font-serif text-xl">{t.modalSubmittedTitle}</h4>
                      </div>
                      <p className="text-sm text-[#524940] font-light leading-relaxed">
                        {t.modalSubmittedText}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Dark Footer Bar (Image 1 Replica) */}
            <div className="modal-anim relative z-10 w-full bg-[#14100E] text-[#F3EFE7] px-6 py-6 md:px-12 md:py-8 border-t border-[#29221C]">
              {/* Subtle Watermark Repeat Pattern Overlay */}
              <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('/brand-pattern.svg')] bg-repeat bg-[length:350px_auto]" />

              <div className="relative z-10 mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
                {/* Left Section */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-[0.22em] text-[#94877A] font-medium">
                    {t.modalDarkLeft1}
                  </span>
                  <span className="text-xs uppercase tracking-[0.22em] text-[#94877A] font-medium">
                    {t.modalDarkLeft2}
                  </span>
                </div>

                {/* Center Section: Logo */}
                <div className="flex items-center justify-center gap-3">
                  <svg width="22" height="26" viewBox="0 0 54 66" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#EBE4D8]">
                    <path d="M12 4V58H32V50H20V4H12Z" fill="currentColor"/>
                    <path d="M38 4L22 58H31L47 4H38Z" fill="currentColor"/>
                    <path d="M28 36H48V44H28V36Z" fill="currentColor"/>
                  </svg>
                  <div className="h-5 w-[1px] bg-[#EBE4D8]/30" />
                  <div className="flex flex-col leading-none text-left">
                    <span className="font-serif text-xs tracking-[0.25em] text-[#EBE4D8] uppercase font-semibold">LYON&apos;S</span>
                    <span className="text-[8px] tracking-[0.35em] text-[#C4B7A6] uppercase font-light">ARTISANS</span>
                  </div>
                </div>

                {/* Right Section: Contact info */}
                <div className="flex flex-col items-center md:items-end gap-1">
                  <span className="text-[11px] uppercase tracking-[0.22em] text-[#94877A] font-medium">
                    {t.modalDarkRightTitle}
                  </span>
                  <a
                    href="mailto:hello@lyonsartisans.mx"
                    className="text-xs sm:text-sm font-medium text-[#F3EFE7] hover:text-[#C9B6A3] transition-colors"
                  >
                    hello@lyonsartisans.mx
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
