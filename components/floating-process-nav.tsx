'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  no: string;
  title: string;
  body: string;
  tagline?: string;
  values: string[];
}

interface FloatingProcessNavProps {
  steps: Step[];
}

export function FloatingProcessNav({ steps }: FloatingProcessNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Scroll Spy & Visibility
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.8) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsOpen(false);
      }

      // Scroll Spy
      let found = false;
      // Iterate backwards so the lowest visible item takes priority if multiple
      for (let i = steps.length - 1; i >= 0; i--) {
        const step = steps[i];
        const el = document.getElementById(`step-${step.no}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          // If the top of the element is above the middle of the screen
          if (rect.top <= window.innerHeight * 0.6) {
            setActiveStep(step.no);
            found = true;
            break;
          }
        }
      }
      if (!found) setActiveStep('');
    };
    
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [steps]);

  const scrollToStep = (id: string) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 transition-all duration-500",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 pointer-events-none"
      )}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Floating Menu List with invisible bridge to prevent hover loss */}
      <div 
        className={cn(
          "absolute bottom-full right-0 pb-4 transition-all duration-300 origin-bottom-right",
          isOpen ? "scale-100 opacity-100 pointer-events-auto" : "scale-95 opacity-0 pointer-events-none"
        )}
      >
        <div className="overflow-hidden rounded-md border border-border bg-card/95 backdrop-blur-md shadow-2xl">
          <div className="flex flex-col py-2 min-w-[260px] max-h-[60vh] overflow-y-auto custom-scrollbar">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-3 px-6 py-3 text-sm text-foreground/60 transition-colors hover:text-foreground hover:bg-muted/50"
            >
              <ArrowUp className="w-4 h-4" />
              <span>Back to top</span>
            </button>
            
            <div className="h-px bg-border/50 my-1 mx-4" />
            
            {steps.map((step, index) => {
              const isActive = activeStep === step.no;
              return (
                <button
                  key={step.no}
                  onClick={() => scrollToStep(`step-${step.no}`)}
                  className={cn(
                    "group flex items-baseline gap-3 px-6 py-2.5 text-left transition-all hover:bg-muted/50",
                    isActive ? "bg-muted/30" : "",
                    isOpen ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
                  )}
                  style={{ 
                    transitionDuration: '400ms',
                    transitionDelay: isOpen ? `${300 + (index * 50)}ms` : '0ms' 
                  }}
                >
                  <span className={cn(
                    "font-serif text-sm transition-colors",
                    isActive ? "text-primary" : "text-primary/60 group-hover:text-primary"
                  )}>
                    {step.no}
                  </span>
                  <span className={cn(
                    "text-sm transition-colors",
                    isActive ? "text-foreground font-medium" : "text-foreground/80 group-hover:text-foreground"
                  )}>
                    {step.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* FAB Button */}
      <button
        onPointerEnter={(e) => {
          if (e.pointerType === 'mouse') {
            setIsOpen(true);
          }
        }}
        onClick={() => setIsOpen(prev => !prev)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 pointer-events-auto"
        aria-label="Process Navigation Menu"
      >
        <div className="relative w-6 h-6">
          <Menu 
            className={cn("absolute inset-0 w-6 h-6 transition-all duration-300", isOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100")} 
          />
          <X 
            className={cn("absolute inset-0 w-6 h-6 transition-all duration-300", isOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0")} 
          />
        </div>
      </button>
    </div>
  );
}
