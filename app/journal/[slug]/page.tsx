'use client'

import React, { use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowUp, ArrowLeft } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import { mockBlogs, blogData } from '@/lib/i18n'
import { MovingBanner } from '@/components/moving-banner'

export default function BlogDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = use(props.params)
  const { lang } = useLanguage()
  const data = blogData[lang]
  
  const blog = mockBlogs.find((b) => b.slug === params.slug)
  
  if (!blog) {
    notFound()
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen pt-24 md:pt-32 pb-24">
      {/* Back to list button */}
      <div className="mx-auto max-w-7xl px-5 md:px-8 mb-8">
        <Link 
          href="/journal" 
          className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {data.backToList}
        </Link>
      </div>

      {/* Hero Image */}
      <div className="mx-auto max-w-7xl px-5 md:px-8 mb-12 md:mb-20">
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9]">
          <Image
            src={blog.image}
            alt={blog.title[lang]}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Moving Banner with Title */}
      <div className="mb-16 md:mb-24">
        <MovingBanner text={`${blog.title[lang]} — `} />
      </div>

      {/* Content Section 1: Intro */}
      <div className="mx-auto max-w-4xl px-5 md:px-8 mb-16 md:mb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
          <div className="md:col-span-4">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground border-b border-border pb-4 mb-4">
              {blog.category[lang]}
            </h3>
          </div>
          <div className="md:col-span-8">
            <p className="font-serif text-2xl md:text-3xl leading-relaxed">
              {blog.excerpt[lang]}
            </p>
            <p className="mt-8 text-muted-foreground leading-loose">
              {/* Mock paragraph text since we don't have full content in our mock data */}
              {lang === 'en' 
                ? "This is a detailed exploration of our craftsmanship and dedication to quality. Every step in our process is carefully considered, from the initial sketch to the final polish. Our artisans bring decades of experience to the table, ensuring that each piece is not only visually stunning but also built to last."
                : "Esta es una exploración detallada de nuestra artesanía y dedicación a la calidad. Cada paso en nuestro proceso es considerado cuidadosamente, desde el boceto inicial hasta el pulido final. Nuestros artesanos aportan décadas de experiencia, asegurando que cada pieza no solo sea visualmente impresionante, sino también hecha para durar."}
            </p>
          </div>
        </div>
      </div>

      {/* Content Images Row */}
      {blog.contentImages && blog.contentImages.length >= 2 && (
        <div className="mx-auto max-w-7xl px-5 md:px-8 mb-16 md:mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative w-full aspect-[4/3]">
              <Image src={blog.contentImages[0]} alt="Content Image 1" fill className="object-cover" />
            </div>
            <div className="relative w-full aspect-[4/3]">
              <Image src={blog.contentImages[1]} alt="Content Image 2" fill className="object-cover" />
            </div>
          </div>
        </div>
      )}

      {/* Content Section 2: Quote & Text */}
      <div className="bg-card py-16 md:py-24 mb-16 md:mb-24">
        <div className="mx-auto max-w-4xl px-5 md:px-8">
          <blockquote className="font-serif text-3xl md:text-5xl text-center leading-tight mb-12">
            “{lang === 'en' ? 'Quality begins with people, and we are committed to preserving traditional craftsmanship.' : 'La calidad comienza con las personas, y estamos comprometidos con preservar la artesanía tradicional.'}”
          </blockquote>
          <p className="text-center text-muted-foreground leading-loose max-w-2xl mx-auto">
             {lang === 'en'
               ? "Through dedication and an uncompromising approach to materials, we continually set new standards for our industry. We believe that true luxury is found in the details that often go unnoticed."
               : "A través de la dedicación y un enfoque intransigente hacia los materiales, establecemos continuamente nuevos estándares para nuestra industria. Creemos que el verdadero lujo se encuentra en los detalles que a menudo pasan desapercibidos."}
          </p>
        </div>
      </div>

      {/* Footer controls: Back to top */}
      <div className="mx-auto max-w-7xl px-5 md:px-8 flex justify-center">
        <button 
          onClick={scrollToTop}
          className="flex flex-col items-center gap-3 group text-muted-foreground hover:text-foreground transition-colors"
        >
          <div className="h-12 w-12 rounded-full border border-border flex items-center justify-center group-hover:border-foreground transition-colors">
            <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
          </div>
          <span className="text-xs uppercase tracking-widest">{lang === 'en' ? 'Back to top' : 'Volver arriba'}</span>
        </button>
      </div>
    </main>
  )
}
