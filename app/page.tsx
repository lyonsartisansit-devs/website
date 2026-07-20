'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '@/components/language-provider';
import { BrandPattern } from '@/components/brand-pattern';
import { ScrollWordReveal } from '@/components/scroll-word-reveal';
import { MorphingWordReveal } from '@/components/morphing-word-reveal';
import { home, routes } from '@/lib/i18n';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const { lang } = useLanguage();
  const t = home[lang];
  const heroRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // 1. Configurar Parallax para el patrón de fondo (esto siempre debe ejecutarse)
      gsap.to('.parallax-bg', {
        yPercent: 40,
        ease: 'none',
        scrollTrigger: {
          trigger: '#intro-trigger',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 30, // scrub: 1 le da un suavizado muy elegante y hace más notorio el efecto
        },
      });

      // 2. Lógica de animación de entrada
      const elements = gsap.utils.toArray('.hero-animate');

      const playIntro = () => {
        gsap.to(elements, {
          yPercent: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.1,
          ease: 'power4.out',
          delay: 0.2,
        });
      };

      const setupIntro = () => {
        if (sessionStorage.getItem('hasSeenLoader')) return;
        gsap.set(elements, { yPercent: 120, opacity: 0 });
        window.addEventListener('introReady', playIntro);
      };

      setupIntro();

      // Animación de la sección Pillars (Our Difference)
      const tlPillars = gsap.timeline({
        scrollTrigger: {
          trigger: '.pillars-wrapper',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      });

      tlPillars.fromTo(
        '.pillar-grid',
        {
          backgroundColor: 'hsl(24, 10%, 85%)', // bg-border
        },
        {
          backgroundColor: 'rgba(109, 72, 53, 0.2)', // bg-[#6D4835]/20
          ease: 'none',
        },
        0,
      );

      const finalColors = ['#3B281C', '#6D4835', '#B5936F'];

      tlPillars.fromTo(
        '.pillar-card',
        {
          backgroundColor: 'hsl(35, 33%, 93%)', // bg-card
          color: 'hsl(20, 14%, 11%)', // text-foreground
          borderColor: 'rgba(255, 255, 255, 0)',
          boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0)',
        },
        {
          backgroundColor: (index) => finalColors[index],
          color: '#E5D9CA', // text-[#E5D9CA]
          borderColor: 'rgba(255, 255, 255, 0.05)',
          boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.05)',
          ease: 'none',
          stagger: 0.15,
        },
        0,
      );

      tlPillars.fromTo(
        '.pillar-leather',
        {
          opacity: 0,
        },
        {
          opacity: 0.85, // Blend intensity for the leather texture
          ease: 'none',
          stagger: 0.15,
        },
        0,
      );

      tlPillars.fromTo(
        '.pillar-number, .pillar-body, .pillar-title',
        {
          color: 'hsl(20, 5%, 45%)', // text-muted-foreground
        },
        {
          color: (index, target) => {
            const card = target.closest('.pillar-container');
            const cards = gsap.utils.toArray('.pillar-container');
            const cardIndex = cards.indexOf(card);
            return cardIndex === 2 ? '#3B281C' : 'rgba(229, 217, 202, 0.9)'; // Dark brown text for the 3rd card
          },
          ease: 'none',
          stagger: 0.15,
        },
        0,
      );

      // Animación de la sección Featured (Trabajo Selecto)
      const tlFeatured = gsap.timeline({
        scrollTrigger: {
          trigger: '.featured-wrapper',
          start: 'top 50%', // Empieza cuando el top de la sección llega al 50% de la pantalla
          end: 'top -100%', // Termina justo antes de que la siguiente sección la cubra
          scrub: 1,
        },
      });

      tlFeatured
        .fromTo(
          '.feature-image-container',
          {
            xPercent: -30,
            opacity: 0,
          },
          {
            xPercent: 0,
            opacity: 1,
            ease: 'power1.out',
          },
        )
        .fromTo(
          '.feature-text-content',
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            ease: 'power1.out',
          },
          '>', // Empieza después de que la imagen termine de moverse
        );

      // Animación de brillo dorado para la flecha
      gsap.to('.feature-arrow', {
        color: '#B5936F',
        filter: 'drop-shadow(0px 0px 4px rgba(181, 147, 111, 0.6))',
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Animación de Stats (Casa de Manufactura)
      const tlStats = gsap.timeline({
        scrollTrigger: {
          trigger: '.stats-section',
          start: 'top 100%',
          end: 'bottom 10%',
          scrub: 3, // Agrega 3 segundos de inercia/suavizado para que nunca se vea acelerada
        },
      });

      tlStats
        .fromTo(
          '.stats-title',
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        )
        .fromTo(
          '.stat-line',
          { width: '0%' },
          { width: '100%', duration: 0.5, ease: 'power2.inOut', stagger: 0.3 },
          '-=0.2',
        )
        .fromTo(
          '.stat-text',
          { yPercent: -100, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.3,
          },
          '<0.2', // El texto baja 0.2s después de que su respectiva línea empieza a crecer
        );

      return () => window.removeEventListener('introReady', playIntro);
    },
    { scope: mainRef, dependencies: [lang] },
  );

  return (
    <main ref={mainRef}>
      {/* Hero */}
      <section
        ref={heroRef}
        className="sticky top-0 relative flex min-h-screen w-full items-end overflow-hidden bg-background"
      >
        <Image
          src="/images/hero.png"
          alt="Artisan hands stitching a premium leather shoe"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/100 via-black/20 to-black/80" />
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-32 md:px-8 md:pb-24">
          <div className="overflow-hidden">
            <p className="hero-animate font-subheading text-xs uppercase tracking-[0.32em] text-background/80">
              {t.heroEyebrow}
            </p>
          </div>
          <div className="overflow-hidden mt-6">
            <h1 className="hero-animate max-w-4xl text-balance font-serif text-4xl font-light leading-[1.05] text-background md:text-6xl lg:text-7xl">
              {t.heroTitle}
            </h1>
          </div>
          <div className="overflow-hidden mt-6">
            <p className="hero-animate max-w-xl text-pretty text-base leading-relaxed text-background/85 md:text-lg">
              {t.heroSubtitle}
            </p>
          </div>
          <div className="overflow-hidden mt-9">
            <div className="hero-animate flex flex-wrap items-center gap-4">
              <Link
                href={routes.about}
                className="group inline-flex items-center gap-2 rounded-sm bg-background px-7 py-3.5 text-sm tracking-wide text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                {t.heroCta}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href={routes.products}
                className="inline-flex items-center gap-2 rounded-sm border border-background/40 px-7 py-3.5 text-sm tracking-wide text-background transition-colors hover:bg-background/10"
              >
                {t.heroCtaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <div id="intro-trigger" className="w-full h-[400vh] relative">
        <section className="intro-section sticky top-0 flex min-h-screen w-full flex-col justify-center bg-background relative overflow-hidden">
          <div className="parallax-bg absolute inset-x-0 -top-[25%] h-[150%] z-0">
            <BrandPattern />
          </div>

          <div className="mx-auto w-full max-w-7xl px-5 py-24 md:px-8 md:py-32 relative z-10">
            <div className="grid gap-10 md:grid-cols-12 md:gap-16">
              <div className="md:col-span-4">
                <p className="font-subheading text-xs uppercase tracking-[0.3em] text-primary">
                  {t.introLabel}
                </p>
              </div>
              <div className="md:col-span-8 flex flex-col gap-6">
                <MorphingWordReveal
                  paragraphs={t.intro
                    .split('.')
                    .filter(Boolean)
                    .map((s) => s.trim())}
                  trigger="#intro-trigger"
                  className="text-balance font-serif text-2xl font-light leading-snug md:text-3xl lg:text-4xl"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Pillars */}
      <div className="pillars-wrapper w-full h-[200vh] relative">
        <section className="sticky top-0 flex min-h-screen w-full flex-col justify-center border-y border-border bg-card overflow-hidden">
          <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32 relative z-10">
            <div className="max-w-3xl">
              <p className="font-subheading text-xs uppercase tracking-[0.3em] text-primary">
                {t.pillarLabel}
              </p>
              <h2 className="mt-5 text-balance font-serif text-3xl font-light leading-tight md:text-5xl">
                {t.pillarTitle}
              </h2>
            </div>
            <div className="pillar-grid mt-16 grid gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-3">
              {t.pillars.map((p, index) => {
                const textures = [
                  '/images/leather-texture-rough.png',
                  '/images/leather-texture-croc.png',
                  '/images/leather-texture.png',
                ];
                return (
                  <div
                    key={p.no}
                    className="pillar-container relative flex flex-col gap-4 p-8 md:p-10 text-muted-foreground border border-transparent overflow-hidden"
                  >
                    <div className="pillar-card absolute inset-0 z-0 bg-card" />
                    <div className="pillar-leather absolute inset-0 z-10 opacity-0 pointer-events-none mix-blend-overlay">
                      <Image
                        src={textures[index]}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>

                    <span className="pillar-number font-mono text-xs tracking-widest text-muted-foreground relative z-20">
                      {p.no}
                    </span>
                    <h3 className="pillar-title font-serif text-2xl text-foreground relative z-20">
                      {p.title}
                    </h3>
                    <p className="pillar-body text-sm leading-relaxed text-muted-foreground relative z-20">
                      {p.body}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* Quote */}
      <div id="quote-trigger" className="w-full h-[200vh] relative">
        <section className="sticky top-0 flex min-h-screen w-full flex-col justify-center bg-background">
          <div className="mx-auto w-full max-w-5xl px-5 py-24 text-center md:px-8 md:py-32">
            <ScrollWordReveal
              text={t.quote}
              trigger="#quote-trigger"
              highlights={[
                'hechos a mano',
                'orgullo',
                'responsabilidad',
                'respeto',
                'made by hand',
                'pride',
                'responsibility',
                'respect',
              ]}
              className="text-balance font-serif text-2xl font-light italic leading-snug md:text-4xl text-[#B5936F]"
            />
          </div>
        </section>
      </div>

      {/* Feature with image */}
      <div className="featured-wrapper w-full h-[300vh] relative z-0">
        <section className="sticky top-0 flex min-h-screen w-full flex-col justify-center border-t border-border bg-background overflow-hidden">
          <div className="mx-auto grid max-w-7xl gap-0 md:grid-cols-2">
            <div className="feature-image-container relative min-h-[60vh] md:min-h-[80vh]">
              <Image
                src="/images/featured.png"
                alt="Premium hand-finished leather footwear"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="feature-text-content flex flex-col justify-center gap-6 px-5 py-16 md:px-12 md:py-20 lg:px-16">
              <p className="font-subheading text-xs uppercase tracking-[0.3em] text-primary">
                {t.featureLabel}
              </p>
              <h2 className="text-balance font-serif text-3xl font-light leading-tight md:text-5xl">
                {t.featureTitle}
              </h2>
              <p className="max-w-md text-pretty leading-relaxed text-muted-foreground">
                {t.featureBody}
              </p>
              <Link
                href={routes.products}
                className="group mt-2 inline-flex items-center gap-2 text-sm tracking-wide text-foreground"
              >
                <span className="border-b border-foreground/30 pb-1 transition-colors group-hover:border-foreground">
                  {t.featureCta}
                </span>
                <ArrowRight className="feature-arrow h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Stats */}
      <section className="stats-section relative z-10 -mt-[100vh] sticky top-0 flex min-h-screen w-full flex-col justify-center border-y border-border bg-card">
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-24">
          <p className="stats-title font-subheading text-xs uppercase tracking-[0.3em] text-primary">
            {t.statsLabel}
          </p>
          <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
            {t.stats.map((s) => (
              <div key={s.label} className="stat-card relative">
                <div className="stat-line absolute top-0 left-0 h-px bg-border w-full origin-left" />
                <div className="overflow-hidden">
                  <div className="stat-text flex flex-col gap-3 pt-6 pb-2">
                    <span className="font-serif text-4xl font-light md:text-5xl">
                      {s.value}
                    </span>
                    <span className="text-sm leading-relaxed text-muted-foreground">
                      {s.label}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="sticky top-0 flex min-h-screen w-full flex-col justify-center bg-background">
        <div className="mx-auto w-full max-w-7xl px-5 py-24 md:px-8 md:py-32">
          <div className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-2xl text-balance font-serif text-4xl font-light leading-tight md:text-6xl">
              {t.ctaTitle}
            </h2>
            <div className="max-w-sm">
              <p className="leading-relaxed text-muted-foreground">
                {t.ctaBody}
              </p>
              <Link
                href={routes.contact}
                className="group mt-6 inline-flex items-center gap-2 rounded-sm bg-foreground px-7 py-3.5 text-sm tracking-wide text-background transition-colors hover:bg-primary"
              >
                {t.ctaButton}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
