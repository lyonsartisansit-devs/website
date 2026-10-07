import createMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Bypass Sanity Studio, API routes, internal Next.js assets, and static files
  if (
    pathname.startsWith('/studio') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/images') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const comingSoon =
    process.env.NEXT_PUBLIC_COMING_SOON === 'true' ||
    process.env.COMING_SOON === 'true'

  if (comingSoon) {
    if (!pathname.includes('/coming-soon')) {
      const matchedLocale = routing.locales.find(
        (loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`)
      )
      const locale = matchedLocale || routing.defaultLocale
      return NextResponse.rewrite(new URL(`/${locale}/coming-soon`, req.url))
    }
  }

  return intlMiddleware(req)
}

export const config = {
  matcher: [
    '/((?!api|_next|_vercel|studio|images|[\\w-]+\\.\\w+).*)',
  ],
}
