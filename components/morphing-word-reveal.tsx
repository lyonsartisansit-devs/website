'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface MorphingWordRevealProps {
  paragraphs: string[];
  className?: string;
  trigger?: string;
}

export function MorphingWordReveal({
  paragraphs,
  className,
  trigger,
}: MorphingWordRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Dividimos cada párrafo en un array de palabras
  const parsedParagraphs = paragraphs.map((p) => p.trim().split(/\s+/));

  useGSAP(
    () => {
      // Configuramos el estado inicial de todas las palabras
      paragraphs.forEach((_, pIndex) => {
        const words = gsap.utils.toArray(
          `.word-p${pIndex}`,
          containerRef.current,
        );
        if (pIndex === 0) {
          // El primer párrafo es completamente visible desde el principio
          gsap.set(words, { yPercent: 0, opacity: 1 });
        } else {
          // Los demás están ocultos abajo
          gsap.set(words, { yPercent: 120, opacity: 0 });
        }
      });

      // Creamos la línea de tiempo principal atada al scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trigger
            ? document.querySelector(trigger)
            : containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      });

      // 1. Animar las transiciones entre párrafos (P0 -> P1, P1 -> P2, etc.)
      for (let p = 0; p < paragraphs.length - 1; p++) {
        const currentWords = gsap.utils.toArray(
          `.word-p${p}`,
          containerRef.current,
        );
        const nextWords = gsap.utils.toArray(
          `.word-p${p + 1}`,
          containerRef.current,
        );

        // Las palabras actuales se van hacia arriba y desaparecen
        // Usamos stagger y duration idénticos para que sea estrictamente palabra por palabra
        tl.to(currentWords, {
          yPercent: -120,
          opacity: 0,
          stagger: 1,
          ease: 'power1.inOut',
          duration: 1,
        });

        // Las palabras siguientes entran desde abajo
        tl.to(nextWords, {
          yPercent: 0,
          opacity: 1,
          stagger: 1,
          ease: 'power1.inOut',
          duration: 1,
        });
      }
    },
    { scope: containerRef, dependencies: [paragraphs, trigger] },
  );

  return (
    <div
      ref={containerRef}
      className={`relative min-h-[300px] w-full ${className || ''}`}
    >
      {parsedParagraphs.map((paragraphWords, pIndex) => (
        <p key={pIndex} className="absolute inset-0 top-0 left-0 w-full">
          {paragraphWords.map((word, wordIndex) => (
            <span
              key={wordIndex}
              className="inline-flex overflow-hidden pb-1 mr-[0.25em] align-bottom"
            >
              <span className={`word-p${pIndex} inline-block origin-bottom`}>
                {word}
                {wordIndex === paragraphWords.length - 1 ? '.' : ''}
              </span>
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}
