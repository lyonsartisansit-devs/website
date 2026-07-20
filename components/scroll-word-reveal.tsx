'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollWordRevealProps {
  text: string;
  className?: string;
  trigger?: string;
  highlights?: string[];
}

export function ScrollWordReveal({ text, className, trigger, highlights = [] }: ScrollWordRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Procesar el texto para encontrar las frases a resaltar
  let parsedParts = [{ text, isHighlight: false }]
  
  if (highlights.length > 0) {
    highlights.forEach(highlight => {
      parsedParts = parsedParts.flatMap(part => {
        if (part.isHighlight) return part
        
        // Split by the exact phrase (case insensitive)
        const regex = new RegExp(`(${highlight})`, 'gi')
        const splits = part.text.split(regex)
        
        return splits.map(split => ({
          text: split,
          isHighlight: split.toLowerCase() === highlight.toLowerCase()
        })).filter(p => p.text !== '') // Remove empty strings
      })
    })
  }

  useGSAP(() => {
    // Create a timeline for the scrub animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger ? document.querySelector(trigger) : containerRef.current,
        start: 'top top', 
        end: 'bottom bottom',   
        scrub: 1,
      }
    })

    // Highlight animation
    const highlightElements = gsap.utils.toArray('.word-highlight', containerRef.current)
    if (highlightElements.length > 0) {
      tl.to(highlightElements, {
        scale: 1.35,
        color: 'rgb(109, 72, 53)',
        stagger: 1,
        duration: 1,
        ease: 'power2.inOut',
      }, '+=0.2')
      
      tl.to(highlightElements, {
        scale: 1,
        stagger: 1,
        duration: 1,
        ease: 'power2.inOut',
      }, '<1') // Start the shrink animation exactly when the first word finishes its growth
    }
  }, { scope: containerRef, dependencies: [text, highlights, trigger] })

  return (
    <p ref={containerRef} className={className}>
      {parsedParts.map((part, i) => {
        if (part.isHighlight) {
          return (
            <span key={i} className="inline-flex pb-1 align-bottom">
              <span className="word-highlight inline-block origin-center">
                {part.text}
              </span>
            </span>
          )
        }
        return <span key={i}>{part.text}</span>
      })}
    </p>
  )
}
