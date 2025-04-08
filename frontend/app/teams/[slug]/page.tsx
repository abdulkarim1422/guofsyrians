import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { MapPin, Users, Calendar, Mail, Phone, Globe, ArrowLeft, Facebook, Twitter, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getTeamBySlug, getTeams } from "@/lib/data"

export async function generateStaticParams() {
  const teams = await getTeams()

  return teams.map((team) => ({
    slug: team.slug,
  }))
}

export default async function TeamPage({ params }: { params: { slug: string } }) {
  const team = await getTeamBySlug(params.slug)

  if (!team) {
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col gap-2">
            <Link
              href="/teams"
              className="flex items-center text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to All Teams
            </Link>
          </div>
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center mt-6">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">{team.name}</h1>
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <MapPin className="mr-1 h-5 w-5" />
                  <span className="text-lg">{team.university}</span>
                </div>
                <p className="text-gray-500 md:text-xl dark:text-gray-400">{team.description}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {team.socialLinks?.facebook && (
                  <Button variant="outline" size="icon" asChild>
                    <Link href={team.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                      <Facebook className="h-4 w-4" />
                      <span className="sr-only">Facebook</span>
                    </Link>
                  </Button>
                )}
                {team.socialLinks?.twitter && (
                  <Button variant="outline" size="icon" asChild>
                    <Link href={team.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                      <Twitter className="h-4 w-4" />
                      <span className="sr-only">Twitter</span>
                    </Link>
                  </Button>
                )}
                {team.socialLinks?.instagram && (
                  <Button variant="outline" size="icon" asChild>
                    <Link href={team.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                      <Instagram className="h-4 w-4" />
                      <span className="sr-only">Instagram</span>
                    </Link>
                  </Button>
                )}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src={team.imageUrl || "/placeholder.svg?height=400&width=600"}
                width={600}
                height={400}
                alt={team.name}
                className="rounded-lg object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Team Details */}
      <section className="w-full py-12 md:py-24 bg-white dark:bg-gray-950">
        <div className="container px-4 md:px-6">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="leadership">Leadership</TabsTrigger>
              <TabsTrigger value="initiatives">Initiatives</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">About Our Team</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  {team.longDescription ||
                    `The ${team.name} is dedicated to representing and advocating for all students at ${team.university}. We work closely with university administration, faculty, and staff to ensure that student voices are heard and that student needs are met.`}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="rounded-lg border p-6">
                    <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                    <div className="space-y-3">
                      {team.email && (
                        <div className="flex items-center">
                          <Mail className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                          <a href={`mailto:${team.email}`} className="text-blue-600 hover:underline dark:text-blue-400">
                            {team.email}
                          </a>
                        </div>
                      )}
                      {team.phone && (
                        <div className="flex items-center">
                          <Phone className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                          <a href={`tel:${team.phone}`} className="text-blue-600 hover:underline dark:text-blue-400">
                            {team.phone}
                          </a>
                        </div>
                      )}
                      {team.website && (
                        <div className="flex items-center">
                          <Globe className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                          <a
                            href={team.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline dark:text-blue-400"
                          >
                            Visit Website
                          </a>
                        </div>
                      )}
                      {team.location && (
                        <div className="flex items-center">
                          <MapPin className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                          <span>{team.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="rounded-lg border p-6">
                    <h3 className="text-xl font-bold mb-4">Office Hours</h3>
                    <div className="space-y-3">
                      {team.officeHours ? (
                        Object.entries(team.officeHours).map(([day, hours]) => (
                          <div key={day} className="flex justify-between">
                            <span className="font-medium">{day}</span>
                            <span>{hours}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400">Monday - Friday: 9:00 AM - 5:00 PM</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="leadership" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Leadership Team</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Meet the dedicated students who lead our union and work tirelessly to represent student interests.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                  {team.leadership
                    ? team.leadership.map((member) => (
                        <Link
                          key={member.id}
                          href={`/teams/${params.slug}/members/${member.slug}`}
                          className="flex flex-col items-center text-center space-y-2 group"
                        >
                          <div className="relative h-32 w-32 rounded-full overflow-hidden">
                            <Image
                              src={member.imageUrl || "/placeholder.svg?height=128&width=128"}
                              alt={member.name}
                              fill
                              className="object-cover transition-transform group-hover:scale-105"
                            />
                          </div>
                          <h3 className="font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400">
                            {member.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{member.position}</p>
                        </Link>
                      ))
                    : Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex flex-col items-center text-center space-y-2">
                          <div className="relative h-32 w-32 rounded-full overflow-hidden">
                            <Image
                              src={`/placeholder.svg?height=128&width=128&text=Member ${i + 1}`}
                              alt={`Team Member ${i + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <h3 className="font-bold">{["President", "Vice President", "Secretary", "Treasurer"][i]}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Student Leader</p>
                        </div>
                      ))}
                </div>
                <div className="flex justify-center mt-8">
                  <Button asChild variant="outline">
                    <Link href={`/teams/${params.slug}/members`}>View All Team Members</Link>
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="initiatives" className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Current Initiatives</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Explore the projects and initiatives our team is currently working on to improve student life.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {team.initiatives
                    ? team.initiatives.map((initiative) => (
                        <div key={initiative.id} className="rounded-lg border p-6 space-y-3">
                          <h3 className="text-xl font-bold">{initiative.title}</h3>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="mr-1 h-4 w-4" />
                            {initiative.date || "Ongoing"}
                          </div>
                          <p className="text-gray-500 dark:text-gray-400">{initiative.description}</p>
                        </div>
                      ))
                    : Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="rounded-lg border p-6 space-y-3">
                          <h3 className="text-xl font-bold">
                            {
                              [
                                "Mental Health Awareness",
                                "Academic Support Program",
                                "Campus Sustainability",
                                "Student Advocacy",
                              ][i]
                            }
                          </h3>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="mr-1 h-4 w-4" />
                            Ongoing
                          </div>
                          <p className="text-gray-500 dark:text-gray-400">
                            {
                              [
                                "Supporting student mental health through workshops and resources.",
                                "Providing tutoring and study resources for academic success.",
                                "Working towards a greener campus through various initiatives.",
                                "Representing student interests in university policy decisions.",
                              ][i]
                            }
                          </p>
                        </div>
                      ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6 text-center">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Get Involved with {team.name}</h2>
            <p className="max-w-[85%] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Join us in making a difference for students at {team.university}.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg">
                <Link href={team.joinLink || "/contact"}>
                  Join Our Team <Users className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

