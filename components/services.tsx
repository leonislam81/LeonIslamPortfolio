"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Compass as Wordpress,
  ShoppingCart,
  Palette,
  Database,
  Bug,
  Settings,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  RefreshCw,
  Zap,
} from "lucide-react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const services = [
  {
    id: "wordpress-dev",
    icon: Wordpress,
    title: "WordPress Development & Management",
    description: "Fast, secure sites with clean themes, SEO basics, and reliable updates.",
    features: ["Custom theme development", "Plugin integration", "Security hardening", "Performance optimization"],
    color: "text-blue-600",
  },
  {
    id: "shopify-setup",
    icon: ShoppingCart,
    title: "Shopify Store Setup & Theme Customization",
    description: "Conversion-ready stores, theme tweaks, product setup, app integrations.",
    features: ["Store configuration", "Theme customization", "Product catalog setup", "Payment integration"],
    color: "text-green-600",
  },
  {
    id: "wix-design",
    icon: Palette,
    title: "Wix Design & Launch",
    description: "Modern, responsive designs delivered quickly.",
    features: ["Custom design", "Mobile optimization", "SEO setup", "Content management"],
    color: "text-purple-600",
  },
  {
    id: "data-entry",
    icon: Database,
    title: "WordPress Data Entry & Content Updates",
    description: "Accurate, consistent pages, posts, and products at scale.",
    features: ["Bulk content upload", "Data migration", "Content formatting", "Quality assurance"],
    color: "text-orange-600",
  },
  {
    id: "bug-fixing",
    icon: Bug,
    title: "Bug Fixing & Performance Optimization",
    description: "Diagnose and fix layout, script, or speed issues; improve Core Web Vitals.",
    features: ["Issue diagnosis", "Code debugging", "Speed optimization", "Cross-browser testing"],
    color: "text-red-600",
  },
  {
    id: "management",
    icon: Settings,
    title: "Ongoing Website Management",
    description: "Backups, uptime checks, edits, and monthly care plans.",
    features: ["Regular backups", "Security monitoring", "Content updates", "Technical support"],
    color: "text-indigo-600",
  },
  {
    id: "seo-optimization",
    icon: TrendingUp,
    title: "SEO Optimization & Analytics",
    description: "Improve search rankings with technical SEO, content optimization, and performance tracking.",
    features: ["Technical SEO audit", "Content optimization", "Analytics setup", "Ranking improvement"],
    color: "text-emerald-600",
  },
  {
    id: "ecommerce-migration",
    icon: RefreshCw,
    title: "E-commerce Platform Migration",
    description: "Seamless migration between platforms while preserving data, SEO, and functionality.",
    features: ["Platform assessment", "Data migration", "SEO preservation", "Testing & validation"],
    color: "text-cyan-600",
  },
  {
    id: "custom-integrations",
    icon: Zap,
    title: "Custom Integrations & Automation",
    description: "Connect your website with third-party tools, APIs, and automated workflows.",
    features: ["API integrations", "Workflow automation", "Custom plugins", "System connections"],
    color: "text-violet-600",
  },
]

export function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const [expandedCard, setExpandedCard] = useState<string | null>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (!prefersReducedMotion && sectionRef.current) {
      gsap.fromTo(
        titleRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      )

      gsap.fromTo(
        cardsRef.current?.children || [],
        { y: 60, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      )
    } else {
      if (titleRef.current) gsap.set(titleRef.current, { opacity: 1, y: 0 })
      if (cardsRef.current?.children) {
        gsap.set(cardsRef.current.children, { opacity: 1, y: 0, scale: 1 })
      }
    }
  }, [])

  const handleCardHover = (cardId: string, isHovering: boolean) => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return

    const card = document.querySelector(`[data-card-id="${cardId}"]`)
    if (card) {
      if (isHovering) {
        gsap.to(card, {
          scale: 1.02,
          y: -5,
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

  const toggleCardExpansion = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId)
  }

  return (
    <section id="services" ref={sectionRef} className="py-20 bg-muted/30 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 ref={titleRef} className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Services I Offer
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive website solutions from development to ongoing management
          </p>
          <div className="w-20 h-1 bg-portfolio-primary mx-auto mt-6 rounded-full"></div>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const IconComponent = service.icon
            const isExpanded = expandedCard === service.id

            return (
              <Card
                key={service.id}
                data-card-id={service.id}
                className="relative overflow-hidden border border-border bg-card hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onMouseEnter={() => handleCardHover(service.id, true)}
                onMouseLeave={() => handleCardHover(service.id, false)}
                onClick={() => toggleCardExpansion(service.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`p-2 rounded-lg bg-muted ${service.color} group-hover:scale-110 transition-transform duration-200`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Professional
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-semibold leading-tight group-hover:text-portfolio-primary transition-colors">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">{service.description}</CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div
                    className={`transition-all duration-300 ${isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}
                  >
                    <div className="space-y-2 mb-4">
                      {service.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-portfolio-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between text-portfolio-primary hover:text-portfolio-primary hover:bg-portfolio-primary/10"
                  >
                    {isExpanded ? "Hide Details" : "See Details"}
                    <ArrowRight className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
