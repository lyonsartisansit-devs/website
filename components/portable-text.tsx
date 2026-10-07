import React from 'react'
import {
  PortableText,
  type PortableTextComponents,
} from '@portabletext/react'

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="font-sans text-base md:text-lg leading-relaxed text-foreground/85 mb-6 last:mb-0">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-foreground mt-10 mb-4 font-normal">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-serif text-xl md:text-2xl text-foreground mt-8 mb-3 font-normal">
        {children}
      </h3>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground/85 font-sans text-base md:text-lg">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 mb-6 space-y-2 text-foreground/85 font-sans text-base md:text-lg">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => {
      const href = value?.href || '#'
      const isExternal =
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        value?.openInNewTab
      return (
        <a
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="text-foreground underline underline-offset-4 decoration-secondary hover:text-primary transition-colors"
        >
          {children}
        </a>
      )
    },
  },
}

export function SanityPortableText({ value }: { value: any }) {
  if (!value || (Array.isArray(value) && value.length === 0)) {
    return null
  }
  return <PortableText value={value} components={components} />
}
