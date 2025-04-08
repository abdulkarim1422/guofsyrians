import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// List of supported languages
export const locales = ["en", "ar", "tr"] as const
export type Locale = (typeof locales)[number]

// Get the preferred locale from headers or default to English
function getLocale(request: NextRequest) {
  const acceptLanguage = request.headers.get("accept-language")
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(",")
      .map((lang) => lang.split(";")[0].trim())
      .find((lang) => locales.includes(lang.substring(0, 2) as Locale))

    if (preferredLocale) {
      return preferredLocale.substring(0, 2) as Locale
    }
  }
  return "en"
}

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const pathname = request.nextUrl.pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url))
  }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next|api|favicon.ico).*)",
  ],
}

