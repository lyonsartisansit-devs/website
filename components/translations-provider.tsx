'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export interface PageTranslation {
  locale: string
  slug: string
}

interface TranslationsContextType {
  translations: PageTranslation[] | null
  setTranslations: (translations: PageTranslation[] | null) => void
}

const TranslationsContext = createContext<TranslationsContextType>({
  translations: null,
  setTranslations: () => {},
})

export function TranslationsProvider({ children }: { children: React.ReactNode }) {
  const [translations, setTranslations] = useState<PageTranslation[] | null>(null)

  return (
    <TranslationsContext.Provider value={{ translations, setTranslations }}>
      {children}
    </TranslationsContext.Provider>
  )
}

export function useTranslationsContext() {
  return useContext(TranslationsContext)
}

export function SetPostTranslations({ translations }: { translations: PageTranslation[] }) {
  const { setTranslations } = useTranslationsContext()

  useEffect(() => {
    setTranslations(translations)
    return () => setTranslations(null)
  }, [translations, setTranslations])

  return null
}
