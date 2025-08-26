"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github, TrendingUp, Users, X, ArrowRight, CheckCircle, Target, Lightbulb } from "lucide-react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const projects = [
  {
    id: "shopify-checkout",
    title: "E-commerce Checkout Optimization",
    platform: "Shopify",
    description: "Redesigned checkout flow for fashion retailer, reducing cart abandonment significantly.",
    impact: "+28% Conversion",
    metrics: { conversion: "+28%", revenue: "+$45K/month", time: "2 weeks" },
    thumbnail: "/modern-shopify-checkout-interface.png",
    technologies: ["Shopify", "Liquid", "JavaScript", "CSS"],
    problem: "High cart abandonment rate (78%) due to complex checkout process and trust issues.",
    approach: "Streamlined checkout to single page, added trust badges, optimized mobile experience.",
    result: "Reduced abandonment to 50%, increased mobile conversions by 35%.",
    testimonial: {
      text: "Leon transformed our checkout completely. Sales increased immediately and customers love the new flow.",
      author: "Sarah Chen",
      role: "Store Owner",
    },
    liveUrl: "#",
    featured: true,
  },
  {
    id: "wordpress-performance",
    title: "WordPress Performance Overhaul",
    platform: "WordPress",
    description: "Complete performance optimization bringing site from poor to excellent Lighthouse scores.",
    impact: "58→95 Lighthouse",
    metrics: { lighthouse: "95/100", loadTime: "-65%", bounce: "-40%" },
    thumbnail: "/wordpress-performance-dashboard-with-green-metrics.png",
    technologies: ["WordPress", "PHP", "MySQL", "CDN"],
    problem: "Slow loading times (8+ seconds) causing high bounce rates and poor SEO rankings.",
    approach: "Image optimization, caching implementation, database cleanup, code minification.",
    result: "Load time reduced to 2.1s, Core Web Vitals all green, 40% bounce rate reduction.",
    testimonial: {
      text: "Our site went from unusably slow to lightning fast. Traffic and engagement both improved dramatically.",
      author: "Mike Rodriguez",
      role: "Business Owner",
    },
    liveUrl: "#",
    featured: true,
  },
  {
    id: "wix-mobile-redesign",
    title: "Mobile-First Wix Redesign",
    platform: "Wix",
    description: "Complete mobile redesign for service business, focusing on user engagement and conversions.",
    impact: "+45% Mobile Engagement",
    metrics: { engagement: "+45%", mobile: "+60%", leads: "+32%" },
    thumbnail: "/modern-mobile-first-wix-website-design.png",
    technologies: ["Wix", "Velo", "JavaScript", "Mobile UX"],
    problem: "Poor mobile experience with 85% bounce rate on mobile devices.",
    approach: "Mobile-first redesign with simplified navigation and touch-optimized interactions.",
    result: "Mobile bounce rate dropped to 35%, mobile leads increased 60%.",
    testimonial: {
      text: "The mobile redesign was exactly what we needed. Our mobile customers finally stay and convert.",
      author: "Lisa Park",
      role: "Service Provider",
    },
    liveUrl: "#",
    featured: false,
  },
  {
    id: "data-migration",
    title: "Large-Scale Data Migration",
    platform: "WordPress",
    description: "Migrated 5,000+ products and posts with custom fields, maintaining SEO and structure.",
    impact: "5K+ Items Migrated",
    metrics: { items: "5,247", accuracy: "99.8%", downtime: "0 hours" },
    thumbnail: "/data-migration-dashboard-with-progress-bars.png",
    technologies: ["WordPress", "MySQL", "PHP", "Custom Scripts"],
    problem: "Complex migration from legacy system with custom data structures and relationships.",
    approach: "Custom migration scripts with data validation, staging environment testing, zero-downtime deployment.",
    result: "100% data integrity maintained, all SEO rankings preserved, seamless transition.",
    testimonial: {
      text: "Leon handled our complex migration flawlessly. Not a single piece of data was lost.",
      author: "David Kim",
      role: "Technical Director",
    },
    featured: false,
  },
  {
    id: "bug-fix-sprint",
    title: "Critical Bug Fix Sprint",
    platform: "Multi-Platform",
    description: "Resolved 15+ critical bugs across WordPress, Shopify, and custom solutions in 48 hours.",
    impact: "15 Bugs Fixed",
    metrics: { bugs: "15", time: "48 hours", uptime: "99.9%" },
    thumbnail: "/bug-tracking-dashboard-with-resolved-issues.png",
    technologies: ["WordPress", "Shopify", "JavaScript", "PHP", "CSS"],
    problem: "Multiple critical issues causing site crashes, payment failures, and user experience problems.",
    approach: "Systematic debugging, priority triage, cross-browser testing, and comprehensive QA.",
    result: "All critical issues resolved, site stability restored, preventive measures implemented.",
    testimonial: {
      text: "Leon saved our launch. Fixed everything quickly and professionally under tight deadline pressure.",
      author: "Jennifer Wu",
      role: "Project Manager",
    },
    featured: false,
  },
  {
    id: "ongoing-management",
    title: "Ongoing Website Management",
    platform: "WordPress",
    description: "Monthly maintenance and updates for growing SaaS company, ensuring security and performance.",
    impact: "99.9% Uptime",
    metrics: { uptime: "99.9%", updates: "24/month", response: "<2 hours" },
    thumbnail: "/website-management-dashboard-with-uptime-metrics.png",
    technologies: ["WordPress", "Security", "Monitoring", "Backups"],
    problem: "Need for reliable ongoing maintenance without internal technical resources.",
    approach: "Proactive monitoring, regular updates, security hardening, performance optimization.",
    result: "Zero security incidents, consistent performance, rapid issue resolution.",
    testimonial: {
      text: "Leon's ongoing support gives us peace of mind. Our site runs perfectly while we focus on business.",
      author: "Alex Thompson",
      role: "CEO",
    },
    featured: false,
  },
]

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const filterRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[0] | null>(null)
  const [filter, setFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  const platforms = ["all", "WordPress", "Shopify", "Wix", "Multi-Platform"]
  const filteredProjects = filter === "all" ? projects : projects.filter((p) => p.platform === filter)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (!prefersReducedMotion && sectionRef.current) {
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

      gsap.from(filterRef.current?.children || [], {
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.1)",
        scrollTrigger: {
          trigger: filterRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      })

      gsap.from(gridRef.current?.children || [], {
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      })
    }

    return () => clearTimeout(timer)
  }, [])

  const handleCardHover = (projectId: string, isHovering: boolean) => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return

    const card = document.querySelector(`[data-project-id="${projectId}"]`)
    if (card) {
      if (isHovering) {
        gsap.to(card, {
          scale: 1.03,
          y: -8,
          duration: 0.3,
          ease: "power2.out",
        })
      } else {
        gsap.to(card, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        })
      }
    }
  }

  const openProjectModal = (project: (typeof projects)[0]) => {
    setSelectedProject(project)
    document.body.style.overflow = "hidden"

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!prefersReducedMotion) {
      gsap.fromTo(
        ".project-modal",
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" },
      )

      gsap.from(".modal-section", {
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.2,
      })
    }
  }

  const closeProjectModal = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!prefersReducedMotion) {
      gsap.to(".project-modal", {
        opacity: 0,
        scale: 0.9,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          setSelectedProject(null)
          document.body.style.overflow = "auto"
        },
      })
    } else {
      setSelectedProject(null)
      document.body.style.overflow = "auto"
    }
  }

  const ProjectSkeleton = () => (
    <Card className="relative overflow-hidden border border-border bg-card animate-pulse">
      <div className="aspect-video bg-muted" />
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-16 h-4 bg-muted rounded" />
          <div className="w-20 h-4 bg-muted rounded" />
        </div>
        <div className="w-3/4 h-5 bg-muted rounded mb-2" />
        <div className="w-full h-4 bg-muted rounded" />
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            <div className="w-12 h-4 bg-muted rounded" />
            <div className="w-16 h-4 bg-muted rounded" />
            <div className="w-10 h-4 bg-muted rounded" />
          </div>
          <div className="w-4 h-4 bg-muted rounded" />
        </div>
      </CardContent>
    </Card>
  )

  return (
    <>
      <section id="projects" ref={sectionRef} className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 ref={titleRef} className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Projects
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real results from real projects across WordPress, Shopify, and Wix platforms
            </p>
          </div>

          {/* Filter buttons */}
          <div ref={filterRef} className="flex flex-wrap justify-center gap-3 mb-12">
            {platforms.map((platform) => (
              <Button
                key={platform}
                variant={filter === platform ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(platform)}
                className={
                  filter === platform
                    ? "bg-portfolio-primary text-portfolio-primary-foreground"
                    : "border-portfolio-primary/30 text-portfolio-primary hover:bg-portfolio-primary/10"
                }
              >
                {platform}
              </Button>
            ))}
          </div>

          {/* Projects grid */}
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? Array.from({ length: 6 }).map((_, index) => <ProjectSkeleton key={`skeleton-${index}`} />)
              : filteredProjects.map((project) => (
                  <Card
                    key={project.id}
                    data-project-id={project.id}
                    className={`relative overflow-hidden border border-border bg-card hover:shadow-lg transition-all duration-300 cursor-pointer ${
                      project.featured ? "ring-2 ring-portfolio-primary/20" : ""
                    }`}
                    onMouseEnter={() => handleCardHover(project.id, true)}
                    onMouseLeave={() => handleCardHover(project.id, false)}
                    onClick={() => openProjectModal(project)}
                  >
                    {project.featured && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-portfolio-primary text-portfolio-primary-foreground">Featured</Badge>
                      </div>
                    )}

                    <div className="aspect-video overflow-hidden">
                      <img
                        src={project.thumbnail || "/placeholder.svg"}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>

                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {project.platform}
                        </Badge>
                        <div className="flex items-center gap-1 text-portfolio-primary font-semibold text-sm">
                          <TrendingUp className="w-4 h-4" />
                          {project.impact}
                        </div>
                      </div>
                      <CardTitle className="text-lg font-semibold leading-tight">{project.title}</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">{project.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.slice(0, 3).map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                          {project.technologies.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{project.technologies.length - 3}
                            </Badge>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
          </div>
        </div>
      </section>

      {/* Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="project-modal bg-background border border-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-foreground">{selectedProject.title}</h3>
                <div className="flex items-center gap-3 mt-2">
                  <Badge>{selectedProject.platform}</Badge>
                  <div className="flex items-center gap-1 text-portfolio-primary font-semibold">
                    <TrendingUp className="w-4 h-4" />
                    {selectedProject.impact}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={closeProjectModal}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 space-y-8">
              {/* Project image */}
              <div className="modal-section aspect-video overflow-hidden rounded-lg">
                <img
                  src={selectedProject.thumbnail || "/placeholder.svg"}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Metrics */}
              <div className="modal-section grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(selectedProject.metrics).map(([key, value]) => (
                  <div key={key} className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-portfolio-primary mb-1">{value}</div>
                    <div className="text-sm text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1")}</div>
                  </div>
                ))}
              </div>

              {/* Problem */}
              <div className="modal-section">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-red-500" />
                  <h4 className="text-lg font-semibold">Problem</h4>
                </div>
                <p className="text-muted-foreground">{selectedProject.problem}</p>
              </div>

              {/* Approach */}
              <div className="modal-section">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  <h4 className="text-lg font-semibold">Approach</h4>
                </div>
                <p className="text-muted-foreground">{selectedProject.approach}</p>
              </div>

              {/* Result */}
              <div className="modal-section">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <h4 className="text-lg font-semibold">Result</h4>
                </div>
                <p className="text-muted-foreground">{selectedProject.result}</p>
              </div>

              {/* Technologies */}
              <div className="modal-section">
                <h4 className="text-lg font-semibold mb-3">Technologies Used</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map((tech) => (
                    <Badge key={tech} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Testimonial */}
              <div className="modal-section bg-muted/50 p-6 rounded-lg">
                <blockquote className="text-lg italic text-foreground mb-4">
                  "{selectedProject.testimonial.text}"
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-portfolio-primary/20 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-portfolio-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">{selectedProject.testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{selectedProject.testimonial.role}</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="modal-section flex gap-4">
                <Button className="bg-portfolio-primary hover:bg-portfolio-primary/90 text-portfolio-primary-foreground">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Live Site
                </Button>
                <Button variant="outline">
                  <Github className="w-4 h-4 mr-2" />
                  View Code
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
