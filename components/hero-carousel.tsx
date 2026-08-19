'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const images = [
  '/images/hero.png', // The original hero image
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=2000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1595950653106-6eb814c97ea8?q=80&w=2000&auto=format&fit=crop',
];

const AUTOPLAY_INTERVAL = 5000;

interface HeroCarouselProps {
  children?: (indicators: React.ReactNode) => React.ReactNode;
}

export function HeroCarousel({ children }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Background Images */}
      {images.map((src, index) => (
        <div
          key={src}
          className={cn(
            'absolute inset-0 transition-opacity duration-1000',
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          )}
        >
          <Image
            src={src}
            alt={`Hero image ${index + 1}`}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}
      
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80" />

      {children && children(
        <div className="flex items-center gap-3 z-20 pointer-events-auto">
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes heroFillProgress {
              0% { transform: scaleX(0); }
              100% { transform: scaleX(1); }
            }
          `}} />
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              className="group relative h-1 w-12 md:w-16 overflow-hidden rounded-full bg-white/20 transition-all hover:bg-white/40"
            >
              {/* The animated progress fill */}
              {index === currentIndex && (
                <div
                  key={currentIndex} // Force remount on slide change
                  className="absolute inset-0 bg-white origin-left"
                  style={{
                    animation: `heroFillProgress ${AUTOPLAY_INTERVAL}ms linear forwards`,
                  }}
                />
              )}
              {/* Keep previous indicators fully filled */}
              {index < currentIndex && (
                <div className="absolute inset-0 bg-white origin-left scale-x-100" />
              )}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
