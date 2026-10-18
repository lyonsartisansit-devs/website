import type { Metadata, Viewport } from 'next'
import { metadata as studioMetadata, viewport as studioViewport } from 'next-sanity/studio'

export const metadata: Metadata = {
  ...studioMetadata,
  title: "Lyon's Artisans — Studio",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export const viewport: Viewport = {
  ...studioViewport,
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
