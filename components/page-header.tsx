'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const elements = gsap.utils.toArray('.page-header-reveal');
      gsap.set(elements, { yPercent: 120, opacity: 0 });

      const playAnim = () => {
        gsap.to(elements, {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
        });
      };

      if (sessionStorage.getItem('hasSeenLoader')) {
        setTimeout(playAnim, 50);
      } else {
        window.addEventListener('introReady', playAnim);
        return () => window.removeEventListener('introReady', playAnim);
      }
    },
    { scope: containerRef, dependencies: [title] },
  );

  return (
    <header
      ref={containerRef}
      className="mx-auto max-w-7xl px-5 pb-12 pt-32 md:px-8 md:pb-20 md:pt-44"
    >
      <div className="overflow-hidden pb-2">
        <p className="page-header-reveal font-subheading text-xs uppercase tracking-[0.32em] text-primary">
          {eyebrow}
        </p>
      </div>
      <div className="overflow-hidden pb-2 mt-4">
        <h1 className="page-header-reveal max-w-4xl text-balance font-serif text-4xl font-light leading-[1.05] md:text-6xl lg:text-7xl">
          {title}
        </h1>
      </div>
      {lead ? (
        <div className="overflow-hidden pb-2 mt-6">
          <p className="page-header-reveal max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
            {lead}
          </p>
        </div>
      ) : null}
    </header>
  );
}
