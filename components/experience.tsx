"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Badge } from "@/components/ui/badge"
import { BriefcaseBusiness, CalendarDays, Check, MapPin, Sparkles, Trophy } from "lucide-react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const experiences = [
  { id: "freelance-specialist", period: "2019 - Present", role: "Freelance Website Specialist", company: "Self-Employed", location: "Remote", type: "Full-time", responsibilities: ["WordPress development and management for 50+ clients", "Shopify store setup and customization for e-commerce businesses", "Wix design and launch for small to medium businesses", "Data entry and content migration projects", "Bug fixing and performance optimization services"], achievements: ["Maintained 98% client satisfaction rate", "Completed 100+ successful projects", "Improved average site performance by 60%", "Reduced client website downtime to <0.1%"], technologies: ["WordPress", "Shopify", "Wix", "PHP", "JavaScript", "MySQL"] },
  { id: "web-developer", period: "2018 - 2019", role: "Junior Web Developer", company: "Digital Solutions BD", location: "Dhaka, Bangladesh", type: "Full-time", responsibilities: ["Assisted in WordPress theme development and customization", "Performed data entry and content management tasks", "Supported senior developers in bug fixing and testing", "Maintained client websites and performed regular updates"], achievements: ["Reduced data entry errors by 95%", "Completed training in advanced WordPress development", "Contributed to 20+ successful client projects"], technologies: ["WordPress", "HTML", "CSS", "JavaScript", "PHP"] },
  { id: "intern-developer", period: "2017 - 2018", role: "Web Development Intern", company: "TechStart Solutions", location: "Dhaka, Bangladesh", type: "Internship", responsibilities: ["Learned WordPress basics and content management", "Assisted with data entry and website maintenance", "Participated in team projects and code reviews", "Gained experience with various web technologies"], achievements: ["Successfully completed 6-month internship program", "Built first WordPress website from scratch", "Received excellent performance review"], technologies: ["WordPress", "HTML", "CSS", "Basic PHP"] },
]

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const experienceListRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, { y: 28, opacity: 0, duration: 0.65, ease: "power3.out", scrollTrigger: { trigger: titleRef.current, start: "top 80%", toggleActions: "play none none none" } })
      gsap.from(experienceListRef.current?.querySelectorAll(".experience-card") ?? [], { y: 28, opacity: 0, duration: 0.65, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: experienceListRef.current, start: "top 78%", toggleActions: "play none none none" } })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="experience" ref={sectionRef} className="relative overflow-hidden bg-muted/30 py-20 md:py-28">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-portfolio-primary/10 to-transparent" />
      <div className="container relative mx-auto px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-portfolio-primary/20 bg-portfolio-primary/10 px-3 py-1 text-sm font-medium text-portfolio-primary"><Sparkles className="h-4 w-4" /> Career journey</div>
          <h2 ref={titleRef} className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">Professional Experience</h2>
          <p className="text-lg leading-relaxed text-muted-foreground">A practical record of building dependable websites, improving performance, and delivering outcomes clients can measure.</p>
        </div>

        <div ref={experienceListRef} className="mx-auto max-w-5xl space-y-5">
          {experiences.map((experience, index) => (
            <article key={experience.id} className="experience-card group relative overflow-hidden rounded-3xl border border-border/80 bg-card/90 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-portfolio-primary/30 hover:shadow-xl sm:p-7">
              <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-portfolio-primary via-portfolio-accent to-portfolio-primary opacity-70" />
              <div className="grid gap-6 lg:grid-cols-[150px_1fr] lg:gap-10">
                <div className="flex items-start justify-between gap-4 lg:block">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-portfolio-primary text-portfolio-primary-foreground shadow-lg shadow-portfolio-primary/20">{index === 0 ? <BriefcaseBusiness className="h-5 w-5" /> : <Trophy className="h-5 w-5" />}</div>
                  <div className="text-right lg:mt-4 lg:text-left"><p className="text-sm font-semibold text-portfolio-primary">{experience.period}</p><p className="mt-1 text-xs text-muted-foreground">{experience.type}</p></div>
                </div>

                <div>
                  <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">{experience.role}</h3>
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground"><span className="font-medium text-foreground">{experience.company}</span><span className="hidden sm:inline">•</span><span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{experience.location}</span></div>
                    </div>
                    <Badge variant="outline" className="w-fit border-portfolio-primary/20 bg-portfolio-primary/5 text-portfolio-primary"><CalendarDays className="mr-1 h-3.5 w-3.5" />{experience.period}</Badge>
                  </div>

                  <div className="grid gap-6 border-y border-border/70 py-5 md:grid-cols-2">
                    <div><p className="mb-3 text-sm font-semibold text-foreground">What I delivered</p><ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">{experience.responsibilities.map((responsibility) => <li key={responsibility} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-portfolio-primary" />{responsibility}</li>)}</ul></div>
                    <div><p className="mb-3 text-sm font-semibold text-foreground">Impact</p><ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">{experience.achievements.map((achievement) => <li key={achievement} className="flex gap-2"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-portfolio-accent" />{achievement}</li>)}</ul></div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">{experience.technologies.map((technology) => <Badge key={technology} variant="secondary" className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground transition-colors group-hover:bg-portfolio-primary/10 group-hover:text-portfolio-primary">{technology}</Badge>)}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
