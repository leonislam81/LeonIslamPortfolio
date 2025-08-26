"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, TrendingUp } from "lucide-react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const experiences = [
  {
    id: "freelance-specialist",
    period: "2019 - Present",
    role: "Freelance Website Specialist",
    company: "Self-Employed",
    location: "Remote",
    type: "Full-time",
    responsibilities: [
      "WordPress development and management for 50+ clients",
      "Shopify store setup and customization for e-commerce businesses",
      "Wix design and launch for small to medium businesses",
      "Data entry and content migration projects",
      "Bug fixing and performance optimization services",
    ],
    achievements: [
      "Maintained 98% client satisfaction rate",
      "Completed 100+ successful projects",
      "Improved average site performance by 60%",
      "Reduced client website downtime to <0.1%",
    ],
    technologies: ["WordPress", "Shopify", "Wix", "PHP", "JavaScript", "MySQL"],
  },
  {
    id: "web-developer",
    period: "2018 - 2019",
    role: "Junior Web Developer",
    company: "Digital Solutions BD",
    location: "Dhaka, Bangladesh",
    type: "Full-time",
    responsibilities: [
      "Assisted in WordPress theme development and customization",
      "Performed data entry and content management tasks",
      "Supported senior developers in bug fixing and testing",
      "Maintained client websites and performed regular updates",
    ],
    achievements: [
      "Reduced data entry errors by 95%",
      "Completed training in advanced WordPress development",
      "Contributed to 20+ successful client projects",
    ],
    technologies: ["WordPress", "HTML", "CSS", "JavaScript", "PHP"],
  },
  {
    id: "intern-developer",
    period: "2017 - 2018",
    role: "Web Development Intern",
    company: "TechStart Solutions",
    location: "Dhaka, Bangladesh",
    type: "Internship",
    responsibilities: [
      "Learned WordPress basics and content management",
      "Assisted with data entry and website maintenance",
      "Participated in team projects and code reviews",
      "Gained experience with various web technologies",
    ],
    achievements: [
      "Successfully completed 6-month internship program",
      "Built first WordPress website from scratch",
      "Received excellent performance review",
    ],
    technologies: ["WordPress", "HTML", "CSS", "Basic PHP"],
  },
]

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (!prefersReducedMotion && sectionRef.current) {
      // Title animation
      gsap.from(titleRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      })

      const timelineLine = timelineRef.current?.querySelector(".timeline-line")
      if (timelineLine) {
        gsap.fromTo(
          timelineLine,
          { scaleY: 0, transformOrigin: "top center" },
          {
            scaleY: 1,
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: timelineRef.current,
              start: "top 80%",
              end: "bottom 20%",
              scrub: 1,
            },
          },
        )
      }

      const cards = timelineRef.current?.querySelectorAll(".experience-card")
      if (cards) {
        cards.forEach((card, index) => {
          gsap.fromTo(
            card,
            {
              x: index % 2 === 0 ? -100 : 100,
              opacity: 0,
              scale: 0.8,
              rotationY: index % 2 === 0 ? -15 : 15,
            },
            {
              x: 0,
              opacity: 1,
              scale: 1,
              rotationY: 0,
              duration: 0.8,
              ease: "back.out(1.7)",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            },
          )

          const cardElement = card as HTMLElement
          cardElement.addEventListener("mouseenter", () => {
            if (!prefersReducedMotion) {
              gsap.to(card, {
                scale: 1.02,
                y: -5,
                duration: 0.3,
                ease: "power2.out",
              })
            }
          })

          cardElement.addEventListener("mouseleave", () => {
            if (!prefersReducedMotion) {
              gsap.to(card, {
                scale: 1,
                y: 0,
                duration: 0.3,
                ease: "power2.out",
              })
            }
          })
        })
      }
    }
  }, [])

  return (
    <section id="experience" ref={sectionRef} className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 ref={titleRef} className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Professional Experience
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            My journey in web development and website management
          </p>
        </div>

        <div ref={timelineRef} className="relative max-w-4xl mx-auto">
          <div className="timeline-line absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-portfolio-primary via-portfolio-primary/60 to-portfolio-primary/20 origin-top rounded-full" />

          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div
                key={exp.id}
                className={`experience-card flex items-center ${index % 2 === 0 ? "" : "flex-row-reverse"}`}
              >
                {/* Timeline dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-portfolio-primary rounded-full border-4 border-background z-10" />

                {/* Content */}
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? "md:pr-8" : "md:pl-8"}`}>
                  <Card className="border border-border bg-card hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="text-xs">
                          {exp.type}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {exp.period}
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold text-foreground mb-1">{exp.role}</h3>
                      <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                        <span className="font-medium">{exp.company}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {exp.location}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-foreground mb-2">Key Responsibilities</h4>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {exp.responsibilities.map((resp, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="w-1 h-1 bg-portfolio-primary rounded-full mt-2 flex-shrink-0" />
                                {resp}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium text-foreground mb-2 flex items-center gap-1">
                            <TrendingUp className="w-4 h-4 text-portfolio-primary" />
                            Key Achievements
                          </h4>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {exp.achievements.map((achievement, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium text-foreground mb-2">Technologies</h4>
                          <div className="flex flex-wrap gap-1">
                            {exp.technologies.map((tech) => (
                              <Badge key={tech} variant="secondary" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block w-2/12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
