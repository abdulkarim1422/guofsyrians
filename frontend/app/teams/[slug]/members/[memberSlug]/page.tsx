import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import {
  ArrowRight,
  Mail,
  Phone,
  Briefcase,
  Award,
  GraduationCap,
  Linkedin,
  Twitter,
  Github,
  Globe,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getTeamBySlug, getMemberBySlug } from "@/lib/data"

export default async function MemberProfilePage({ params }: { params: { slug: string; memberSlug: string } }) {
  const team = await getTeamBySlug(params.slug)
  const member = await getMemberBySlug(params.memberSlug)

  if (!team || !member || member.teamId !== team.id) {
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/teams/${params.slug}`}
                className="flex items-center text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              >
                <ArrowRight className="ml-1 h-4 w-4" />
                {/* Using Arabic text */}
                العودة إلى {team.name}
              </Link>
              <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
              <Link
                href={`/teams/${params.slug}/members`}
                className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              >
                جميع الأعضاء
              </Link>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr] items-start mt-6">
            <div className="space-y-8 order-2 lg:order-1">
              {/* Bio Section */}
              <Card>
                <CardHeader>
                  <CardTitle>نبذة عني</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">
                    {member.bio || `${member.name} هو ${member.position} في ${team.name}.`}
                  </p>
                </CardContent>
              </Card>

              {/* Education Section */}
              {member.education && member.education.length > 0 && (
                <Card>
                  <CardHeader className="flex flex-row items-center">
                    <GraduationCap className="ml-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <CardTitle>التعليم</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {member.education.map((edu, index) => (
                        <div key={index} className={index > 0 ? "pt-4 border-t" : ""}>
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold">
                                {edu.degree} في {edu.field}
                              </h3>
                              <p className="text-gray-700 dark:text-gray-300">{edu.institution}</p>
                            </div>
                            <div className="text-gray-500 dark:text-gray-400 text-sm">
                              {edu.startYear} - {edu.endYear || "الحالي"}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Experience Section */}
              {member.experience && member.experience.length > 0 && (
                <Card>
                  <CardHeader className="flex flex-row items-center">
                    <Briefcase className="ml-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <CardTitle>الخبرات</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {member.experience.map((exp, index) => (
                        <div key={index} className={index > 0 ? "pt-4 border-t" : ""}>
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold">{exp.position}</h3>
                              <p className="text-gray-700 dark:text-gray-300">{exp.organization}</p>
                            </div>
                            <div className="text-gray-500 dark:text-gray-400 text-sm">
                              {exp.startDate} - {exp.endDate || "الحالي"}
                            </div>
                          </div>
                          {exp.description && (
                            <p className="mt-2 text-gray-600 dark:text-gray-400">{exp.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Skills Section */}
              {member.skills && member.skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>المهارات</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {member.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Achievements Section */}
              {member.achievements && member.achievements.length > 0 && (
                <Card>
                  <CardHeader className="flex flex-row items-center">
                    <Award className="ml-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <CardTitle>الإنجازات</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {member.achievements.map((achievement, index) => (
                        <div key={index} className={index > 0 ? "pt-4 border-t" : ""}>
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold">{achievement.title}</h3>
                            {achievement.date && (
                              <div className="text-gray-500 dark:text-gray-400 text-sm">{achievement.date}</div>
                            )}
                          </div>
                          {achievement.description && (
                            <p className="mt-2 text-gray-600 dark:text-gray-400">{achievement.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="flex flex-col items-center text-center lg:sticky lg:top-20 order-1 lg:order-2">
              <div className="relative h-48 w-48 overflow-hidden rounded-full mb-4">
                <Image
                  src={member.imageUrl || "/placeholder.svg?height=192&width=192"}
                  alt={member.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <h1 className="text-2xl font-bold">{member.name}</h1>
              <p className="text-blue-600 text-lg dark:text-blue-400">{member.position}</p>
              <p className="text-gray-500 dark:text-gray-400">{team.name}</p>

              <div className="flex flex-col items-center mt-4 space-y-2 w-full">
                {member.email && (
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Mail className="ml-2 h-4 w-4" />
                    <a href={`mailto:${member.email}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                      {member.email}
                    </a>
                  </div>
                )}
                {member.phone && (
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Phone className="ml-2 h-4 w-4" />
                    <a href={`tel:${member.phone}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                      {member.phone}
                    </a>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center mt-6 space-x-4">
                {member.socialLinks?.linkedin && (
                  <a
                    href={member.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                  >
                    <Linkedin className="h-4 w-4" />
                    <span className="text-sm">/</span>
                    <span className="text-sm">{member.socialLinks.linkedin.split("/").pop() || "profile"}</span>
                  </a>
                )}
                {member.socialLinks?.twitter && (
                  <a
                    href={member.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                  >
                    <Twitter className="h-4 w-4" />
                    <span className="text-sm">/</span>
                    <span className="text-sm">{member.socialLinks.twitter.split("/").pop() || "profile"}</span>
                  </a>
                )}
                {member.socialLinks?.github && (
                  <a
                    href={member.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                  >
                    <Github className="h-4 w-4" />
                    <span className="text-sm">/</span>
                    <span className="text-sm">{member.socialLinks.github.split("/").pop() || "profile"}</span>
                  </a>
                )}
                {member.socialLinks?.website && (
                  <a
                    href={member.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400"
                  >
                    <Globe className="h-4 w-4" />
                    <span className="text-sm">/</span>
                    <span className="text-sm">{new URL(member.socialLinks.website).hostname.replace("www.", "")}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

