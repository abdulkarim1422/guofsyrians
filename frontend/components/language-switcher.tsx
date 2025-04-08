"use client"
import { usePathname, useRouter } from "next/navigation"
import { Languages } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { translations } from "@/lib/i18n/translations"
import { locales } from "@/middleware"

export function LanguageSwitcher() {
  const pathname = usePathname()
  const router = useRouter()

  const switchLanguage = (locale: string) => {
    // Get the current path without the locale prefix
    const currentPath = pathname.split("/").slice(2).join("/")
    // Navigate to the same path with new locale
    router.push(`/${locale}/${currentPath}`)
  }

  // Get current locale from the pathname
  const currentLocale = pathname.split("/")[1]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Languages className="h-4 w-4" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          <DropdownMenuItem key={locale} className="cursor-pointer" onClick={() => switchLanguage(locale)}>
            <span className={currentLocale === locale ? "font-bold" : ""}>
              {translations[locale].common.languageName}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

