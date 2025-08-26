"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const skills = [
  { name: "WordPress", level: 95, category: "CMS" },
  { name: "Shopify", level: 90, category: "E-commerce" },
  { name: "Wix", level: 85, category: "Website Builder" },
  { name: "WordPress Data Entry", level: 98, category: "Data Management" },
  { name: "Copy-Paste/Data Migration", level: 95, category: "Data Management" },
  { name: "Website Management", level: 92, category: "Maintenance" },
  { name: "Bug Fixing", level: 88, category: "Development" },
  { name: "Performance Optimization", level: 85, category: "Development" },
]

const categories = ["CMS", "E-commerce", "Website Builder", "Data Management", "Maintenance", "Development"]

export function Skills() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const badgesRef = useRef<HTMLDivElement>(null)
  const skillsRef = useRef<HTMLDivElement>(null)
  const [animatedLevels, setAnimatedLevels] = useState<{ [key: string]: number }>({})

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
          once: true,
        },
      })

      // Category badges animation
      gsap.from(badgesRef.current?.children || [], {
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.1)",
        scrollTrigger: {
          trigger: badgesRef.current,
          start: "top 80%",
          once: true,
        },
      })

      // Skills animation with counter effect
      const skillElements = skillsRef.current?.children || []
      gsap.from(skillElements, {
        x: -30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: skillsRef.current,
          start: "top 80%",
          once: true,
          onEnter: () => {
            // Animate skill level counters
            skills.forEach((skill) => {
              const counter = { value: 0 }
              gsap.to(counter, {
                value: skill.level,
                duration: 1.5,
                ease: "power2.out",
                onUpdate: () => {
                  setAnimatedLevels((prev) => ({
                    ...prev,
                    [skill.name]: Math.round(counter.value),
                  }))
                },
              })
            })
          },
        },
      })
    } else {
      // Set final values immediately if reduced motion is preferred
      const finalLevels: { [key: string]: number } = {}
      skills.forEach((skill) => {
        finalLevels[skill.name] = skill.level
      })
      setAnimatedLevels(finalLevels)
    }
  }, [])

  return (
    <section id="skills" ref={sectionRef} className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 ref={titleRef} className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Skills & Expertise
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Specialized in modern web technologies with proven track record
          </p>
        </div>

        {/* Category badges */}
        <div ref={badgesRef} className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Badge
              key={category}
              variant="outline"
              className="px-4 py-2 text-sm font-medium border-portfolio-primary/30 text-portfolio-primary hover:bg-portfolio-primary/10 transition-colors"
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Skills grid */}
        <div ref={skillsRef} className="max-w-4xl mx-auto space-y-6">
          {skills.map((skill) => (
            <div
              key={skill.name}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-foreground">{skill.name}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {skill.category}
                  </Badge>
                </div>
                <span className="text-2xl font-bold text-portfolio-primary">{animatedLevels[skill.name] || 0}%</span>
              </div>
              <Progress
                value={animatedLevels[skill.name] || 0}
                className="h-2"
                style={{
                  background: "var(--color-muted)",
                }}
              />
            </div>
          ))}
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-3xl mx-auto">
          <div className="text-center p-6 bg-card border border-border rounded-lg">
            <div className="text-3xl font-bold text-portfolio-primary mb-2">5+</div>
            <div className="text-sm text-muted-foreground">Years Experience</div>
          </div>
          <div className="text-center p-6 bg-card border border-border rounded-lg">
            <div className="text-3xl font-bold text-portfolio-primary mb-2">100+</div>
            <div className="text-sm text-muted-foreground">Projects Completed</div>
          </div>
          <div className="text-center p-6 bg-card border border-border rounded-lg">
            <div className="text-3xl font-bold text-portfolio-primary mb-2">98%</div>
            <div className="text-sm text-muted-foreground">Client Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  )
}
