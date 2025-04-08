import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ArrowLeft, Mail, Linkedin, Twitter, Github, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getTeamBySlug, getTeamMembers } from "@/lib/data"

export default async function TeamMembersPage({ params }: { params: { slug: string } }) {
  const team = await getTeamBySlug(params.slug)

  if (!team) {
    notFound()
  }

  const members = await getTeamMembers(params.slug)

  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col gap-2">
            <Link
              href={`/teams/${params.slug}`}
              className="flex items-center text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to {team.name}
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center space-y-4 text-center mt-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Meet Our Team</h1>
              <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                The dedicated individuals who make up the {team.name}.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6">
          {members.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {members.map((member) => (
                <Link
                  key={member.id}
                  href={`/teams/${params.slug}/members/${member.slug}`}
                  className="group flex flex-col items-center text-center rounded-lg border p-6 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="relative h-40 w-40 overflow-hidden rounded-full mb-4">
                    <Image
                      src={member.imageUrl || "/placeholder.svg?height=160&width=160"}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-blue-600 dark:text-blue-400">{member.position}</p>
                  {member.email && (
                    <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <Mail className="mr-1 h-4 w-4" />
                      <span>{member.email}</span>
                    </div>
                  )}
                  <p className="mt-3 text-gray-500 line-clamp-3 dark:text-gray-400">
                    {member.bio || `${member.name} is a member of the ${team.name}.`}
                  </p>
                  <div className="flex items-center justify-center mt-4 space-x-2">
                    {member.socialLinks?.linkedin && (
                      <a
                        href={member.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                      >
                        <Linkedin className="h-5 w-5" />
                        <span className="sr-only">LinkedIn</span>
                      </a>
                    )}
                    {member.socialLinks?.twitter && (
                      <a
                        href={member.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                      >
                        <Twitter className="h-5 w-5" />
                        <span className="sr-only">Twitter</span>
                      </a>
                    )}
                    {member.socialLinks?.github && (
                      <a
                        href={member.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                      >
                        <Github className="h-5 w-5" />
                        <span className="sr-only">GitHub</span>
                      </a>
                    )}
                    {member.socialLinks?.website && (
                      <a
                        href={member.socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
                      >
                        <Globe className="h-5 w-5" />
                        <span className="sr-only">Website</span>
                      </a>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-bold mb-2">No Members Found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                There are currently no members listed for this team.
              </p>
              <Button asChild>
                <Link href={`/teams/${params.slug}`}>Return to Team Page</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

