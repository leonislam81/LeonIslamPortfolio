"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Pause, Play, Quote, Sparkles, Star } from "lucide-react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const testimonials = [
  { id: "sarah-chen", name: "Sarah Chen", role: "E-commerce Store Owner", company: "Fashion Forward", rating: 5, quote: "Leon transformed our Shopify store completely. The new checkout flow increased our conversions by 28% in just two weeks. His attention to detail and understanding of e-commerce is exceptional.", project: "Shopify Checkout Optimization", result: "+28% conversions" },
  { id: "mike-rodriguez", name: "Mike Rodriguez", role: "Business Owner", company: "Rodriguez Consulting", rating: 5, quote: "Our WordPress site went from unusably slow to lightning fast. Leon's performance optimization brought our Lighthouse score from 58 to 95. Traffic and engagement both improved dramatically.", project: "WordPress Performance Overhaul", result: "95 Lighthouse score" },
  { id: "lisa-park", name: "Lisa Park", role: "Service Provider", company: "Park Design Studio", rating: 5, quote: "The mobile redesign was exactly what we needed. Leon understood our vision and delivered a beautiful, functional site. Our mobile customers finally stay and convert instead of bouncing.", project: "Mobile-First Wix Redesign", result: "Mobile-first UX" },
  { id: "david-kim", name: "David Kim", role: "Technical Director", company: "TechStart Solutions", rating: 5, quote: "Leon handled our complex data migration flawlessly. 5,000+ items moved with 99.8% accuracy and zero downtime. His technical expertise and project management skills are outstanding.", project: "Large-Scale Data Migration", result: "99.8% accuracy" },
  { id: "jennifer-wu", name: "Jennifer Wu", role: "Project Manager", company: "Digital Innovations", rating: 5, quote: "Leon saved our product launch. He fixed 15 critical bugs in 48 hours under intense deadline pressure. Professional, fast, and reliable - exactly what you want in a crisis.", project: "Critical Bug Fix Sprint", result: "48-hour turnaround" },
  { id: "alex-thompson", name: "Alex Thompson", role: "CEO", company: "CloudSync Pro", rating: 5, quote: "Leon's ongoing website management gives us complete peace of mind. 99.9% uptime, proactive monitoring, and rapid response times. Our site runs perfectly while we focus on growing the business.", project: "Ongoing Website Management", result: "99.9% uptime" },
]

const initials = (name: string) => name.split(" ").map((part) => part[0]).join("")

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const currentTestimonial = testimonials[currentIndex]

  useEffect(() => {
    if (!sectionRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, { y: 28, opacity: 0, duration: 0.65, ease: "power3.out", scrollTrigger: { trigger: titleRef.current, start: "top 80%", toggleActions: "play none none none" } })
      gsap.from(cardRef.current, { y: 34, opacity: 0, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: cardRef.current, start: "top 80%", toggleActions: "play none none none" } })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = window.setInterval(() => setCurrentIndex((index) => (index + 1) % testimonials.length), 6500)
    return () => window.clearInterval(interval)
  }, [isAutoPlaying])

  useEffect(() => {
    if (!cardRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    gsap.fromTo(cardRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out", overwrite: "auto" })
  }, [currentIndex])

  const goTo = (index: number) => { setCurrentIndex(index); setIsAutoPlaying(false) }
  const previous = () => goTo((currentIndex - 1 + testimonials.length) % testimonials.length)
  const next = () => goTo((currentIndex + 1) % testimonials.length)

  return (
    <section id="testimonials" ref={sectionRef} className="relative overflow-hidden bg-background py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,color-mix(in_oklab,var(--portfolio-primary)_10%,transparent),transparent_28rem)]" />
      <div className="container relative mx-auto px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-portfolio-primary/20 bg-portfolio-primary/10 px-3 py-1 text-sm font-medium text-portfolio-primary"><Sparkles className="h-4 w-4" /> Client outcomes</div>
          <h2 ref={titleRef} className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">What clients say after launch</h2>
          <p className="text-lg leading-relaxed text-muted-foreground">Real project results from business owners and teams who needed their websites to work harder.</p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-4 text-center shadow-sm"><p className="text-2xl font-bold text-portfolio-primary">5.0/5</p><p className="mt-1 text-xs text-muted-foreground">Client rating</p></div>
          <div className="rounded-2xl border border-border bg-card p-4 text-center shadow-sm"><p className="text-2xl font-bold text-portfolio-primary">98%</p><p className="mt-1 text-xs text-muted-foreground">Satisfaction rate</p></div>
          <div className="rounded-2xl border border-border bg-card p-4 text-center shadow-sm"><p className="text-2xl font-bold text-portfolio-primary">100+</p><p className="mt-1 text-xs text-muted-foreground">Projects completed</p></div>
        </div>

        <div className="mx-auto mt-5 max-w-5xl overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl shadow-portfolio-primary/10">
          <div ref={cardRef} className="grid min-h-[420px] lg:grid-cols-[0.85fr_1.15fr]">
            <aside className="relative overflow-hidden bg-gradient-to-br from-portfolio-primary to-portfolio-accent p-7 text-white sm:p-10">
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border border-white/20" />
              <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
              <div className="relative flex h-full flex-col justify-between gap-12">
                <div><Quote className="h-12 w-12 text-white/60" /><p className="mt-6 text-sm font-medium uppercase tracking-[0.18em] text-white/70">Featured result</p><p className="mt-2 text-3xl font-bold tracking-tight">{currentTestimonial.result}</p></div>
                <div><div className="flex gap-1">{Array.from({ length: currentTestimonial.rating }).map((_, index) => <Star key={index} className="h-4 w-4 fill-current text-yellow-300" />)}</div><p className="mt-4 text-sm leading-relaxed text-white/80">{currentTestimonial.project}</p></div>
              </div>
            </aside>

            <div className="flex flex-col justify-between p-7 sm:p-10">
              <blockquote aria-live="polite" className="text-xl font-medium leading-relaxed tracking-tight text-foreground sm:text-2xl">“{currentTestimonial.quote}”</blockquote>
              <div className="mt-8 flex flex-col gap-5 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-portfolio-primary/10 font-bold text-portfolio-primary">{initials(currentTestimonial.name)}</div><div><p className="font-semibold text-foreground">{currentTestimonial.name}</p><p className="text-sm text-muted-foreground">{currentTestimonial.role} · {currentTestimonial.company}</p></div></div>
                <span className="w-fit rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">{currentIndex + 1} / {testimonials.length}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-border bg-muted/30 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div className="flex items-center gap-2" aria-label="Select testimonial">{testimonials.map((testimonial, index) => <button key={testimonial.id} type="button" onClick={() => goTo(index)} aria-label={`Show testimonial from ${testimonial.name}`} aria-current={index === currentIndex} className={`h-2.5 rounded-full transition-all ${index === currentIndex ? "w-8 bg-portfolio-primary" : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"}`} />)}</div>
            <div className="flex items-center gap-2"><Button variant="outline" size="icon" onClick={previous} aria-label="Previous testimonial"><ChevronLeft className="h-4 w-4" /></Button><Button variant="outline" size="icon" onClick={next} aria-label="Next testimonial"><ChevronRight className="h-4 w-4" /></Button><Button variant="ghost" size="sm" onClick={() => setIsAutoPlaying((value) => !value)} className="ml-1 gap-2 text-muted-foreground">{isAutoPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}{isAutoPlaying ? "Pause" : "Play"}</Button></div>
          </div>
        </div>
      </div>
    </section>
  )
}
