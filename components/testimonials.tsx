"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star, Quote, Users } from "lucide-react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const testimonials = [
  {
    id: "sarah-chen",
    name: "Sarah Chen",
    role: "E-commerce Store Owner",
    company: "Fashion Forward",
    rating: 5,
    text: "Leon transformed our Shopify store completely. The new checkout flow increased our conversions by 28% in just two weeks. His attention to detail and understanding of e-commerce is exceptional.",
    project: "Shopify Checkout Optimization",
    avatar: "/professional-woman-avatar.png",
  },
  {
    id: "mike-rodriguez",
    name: "Mike Rodriguez",
    role: "Business Owner",
    company: "Rodriguez Consulting",
    rating: 5,
    text: "Our WordPress site went from unusably slow to lightning fast. Leon's performance optimization brought our Lighthouse score from 58 to 95. Traffic and engagement both improved dramatically.",
    project: "WordPress Performance Overhaul",
    avatar: "/professional-man-avatar.png",
  },
  {
    id: "lisa-park",
    name: "Lisa Park",
    role: "Service Provider",
    company: "Park Design Studio",
    rating: 5,
    text: "The mobile redesign was exactly what we needed. Leon understood our vision and delivered a beautiful, functional site. Our mobile customers finally stay and convert instead of bouncing.",
    project: "Mobile-First Wix Redesign",
    avatar: "/creative-woman-avatar.png",
  },
  {
    id: "david-kim",
    name: "David Kim",
    role: "Technical Director",
    company: "TechStart Solutions",
    rating: 5,
    text: "Leon handled our complex data migration flawlessly. 5,000+ items moved with 99.8% accuracy and zero downtime. His technical expertise and project management skills are outstanding.",
    project: "Large-Scale Data Migration",
    avatar: "/technical-professional-avatar.png",
  },
  {
    id: "jennifer-wu",
    name: "Jennifer Wu",
    role: "Project Manager",
    company: "Digital Innovations",
    rating: 5,
    text: "Leon saved our product launch. He fixed 15 critical bugs in 48 hours under intense deadline pressure. Professional, fast, and reliable - exactly what you want in a crisis.",
    project: "Critical Bug Fix Sprint",
    avatar: "/project-manager-woman-avatar.png",
  },
  {
    id: "alex-thompson",
    name: "Alex Thompson",
    role: "CEO",
    company: "CloudSync Pro",
    rating: 5,
    text: "Leon's ongoing website management gives us complete peace of mind. 99.9% uptime, proactive monitoring, and rapid response times. Our site runs perfectly while we focus on growing the business.",
    project: "Ongoing Website Management",
    avatar: "/ceo-professional-avatar.png",
  },
]

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

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

      // Initial carousel animation
      gsap.from(carouselRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: carouselRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      })
    }
  }, [])

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return

    // Animate testimonial change
    const testimonialCard = carouselRef.current?.querySelector(".testimonial-card")
    if (testimonialCard) {
      gsap.fromTo(testimonialCard, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" })
    }
  }, [currentIndex])

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section id="testimonials" ref={sectionRef} className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 ref={titleRef} className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Clients Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real feedback from real clients who've experienced the difference
          </p>
        </div>

        <div ref={carouselRef} className="max-w-4xl mx-auto">
          <Card className="testimonial-card border border-border bg-card shadow-lg">
            <CardContent className="p-8 md:p-12">
              <div className="flex items-center justify-center mb-6">
                <Quote className="w-12 h-12 text-portfolio-primary/30" />
              </div>

              <blockquote className="text-xl md:text-2xl text-center text-foreground leading-relaxed mb-8 italic">
                "{currentTestimonial.text}"
              </blockquote>

              <div className="flex items-center justify-center mb-6">
                {[...Array(currentTestimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-foreground text-lg">{currentTestimonial.name}</div>
                  <div className="text-muted-foreground">{currentTestimonial.role}</div>
                  <div className="text-sm text-muted-foreground">{currentTestimonial.company}</div>
                </div>
              </div>

              <div className="text-center">
                <span className="inline-block px-3 py-1 bg-portfolio-primary/10 text-portfolio-primary text-sm rounded-full">
                  {currentTestimonial.project}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button variant="outline" size="icon" onClick={goToPrevious} aria-label="Previous testimonial">
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? "bg-portfolio-primary" : "bg-muted-foreground/30"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <Button variant="outline" size="icon" onClick={goToNext} aria-label="Next testimonial">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              {currentIndex + 1} of {testimonials.length} testimonials
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
