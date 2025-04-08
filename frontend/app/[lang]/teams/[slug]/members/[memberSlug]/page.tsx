// Update the imports at the top of your file
import { getDictionary } from "@/lib/i18n/get-dictionary"
import type { Locale } from "@/middleware"
import { getTeamBySlug } from "@/lib/teams"
import { getMemberBySlug } from "@/lib/members"
import { notFound } from "next/navigation"
import Link from "next/link"
import { CardTitle } from "@/components/ui/card"

// Update the component props to include lang
export default async function MemberProfilePage({
  params: { lang, slug, memberSlug },
}: {
  params: {
    lang: Locale
    slug: string
    memberSlug: string
  }
}) {
  const dict = await getDictionary(lang)
  const team = await getTeamBySlug(slug)
  const member = await getMemberBySlug(memberSlug)

  if (!team || !member || member.teamId !== team.id) {
    notFound()
  }

  return (
    // Your existing JSX, but using translations
    <div className="flex flex-col min-h-screen">
      {/* ... */}
      <Link href={`/${lang}/teams/${slug}`}>
        {dict.common.back} {team.name}
      </Link>
      {/* ... */}
      <CardTitle>{dict.common.education}</CardTitle>
      {/* ... continue updating text with translations */}
    </div>
  )
}

