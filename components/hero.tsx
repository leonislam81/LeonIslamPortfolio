"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import { TextPlugin } from "gsap/TextPlugin"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, Zap, Search, CheckCircle, Sun, Moon, Menu } from "lucide-react"
import { useTheme } from "next-themes"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollToPlugin, TextPlugin)
}

export function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subheadRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const badgesRef = useRef<HTMLDivElement>(null)
  const backgroundRef = useRef<HTMLDivElement>(null)
  const scrollCueRef = useRef<HTMLButtonElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const rippleRef = useRef<HTMLDivElement>(null)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (!prefersReducedMotion && heroRef.current) {
      const tl = gsap.timeline({ delay: 0.2 })

      if (headerRef.current) {
        gsap.from(headerRef.current, {
          y: -100,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        })

        gsap.to(headerRef.current, {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top -50px",
            end: "bottom top",
            toggleActions: "play none none reverse",
          },
        })
      }

      const handleMouseMove = (e: MouseEvent) => {
        if (cursorRef.current && heroRef.current) {
          const rect = heroRef.current.getBoundingClientRect()
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top

          gsap.to(cursorRef.current, {
            x: x - 25,
            y: y - 25,
            duration: 0.3,
            ease: "power2.out",
          })

          // Create ripple effect
          if (rippleRef.current) {
            const ripple = document.createElement("div")
            ripple.className = "absolute w-4 h-4 bg-portfolio-primary/20 rounded-full pointer-events-none"
            ripple.style.left = `${x - 8}px`
            ripple.style.top = `${y - 8}px`
            rippleRef.current.appendChild(ripple)

            gsap.fromTo(
              ripple,
              { scale: 0, opacity: 1 },
              {
                scale: 8,
                opacity: 0,
                duration: 1.5,
                ease: "power2.out",
                onComplete: () => ripple.remove(),
              },
            )
          }
        }
      }

      heroRef.current.addEventListener("mousemove", handleMouseMove)

      if (headlineRef.current) {
        const words = headlineRef.current.textContent?.split(" ") || []
        headlineRef.current.innerHTML = words.map((word) => `<span class="inline-block">${word}</span>`).join(" ")

        tl.from(headlineRef.current.children, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
        })
      }

      tl.from(
        subheadRef.current,
        {
          y: 30,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.4",
      )

      tl.from(
        ctaRef.current?.children || [],
        {
          y: 30,
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "back.out(1.2)",
        },
        "-=0.3",
      )

      tl.from(
        badgesRef.current?.children || [],
        {
          scale: 0.8,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "back.out(1.1)",
        },
        "-=0.4",
      )

      tl.from(
        scrollCueRef.current,
        {
          y: 20,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.2",
      )

      if (backgroundRef.current) {
        gsap.to(backgroundRef.current.children, {
          y: -50,
          duration: 1,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        })
      }

      if (ctaRef.current) {
        Array.from(ctaRef.current.children).forEach((button, index) => {
          gsap.to(button, {
            y: -3,
            duration: 2 + index * 0.5,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: index * 0.3,
          })
        })
      }

      if (scrollCueRef.current) {
        gsap.to(scrollCueRef.current, {
          y: 8,
          duration: 1.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        })
      }

      return () => {
        heroRef.current?.removeEventListener("mousemove", handleMouseMove)
      }
    }
  }, [])

  const scrollToSection = (sectionId: string) => {
    gsap.to(window, {
      duration: 1,
      scrollTo: { y: sectionId, offsetY: 80 },
      ease: "power2.inOut",
    })
  }

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/20"
    >
      <div ref={backgroundRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-portfolio-primary/20 to-portfolio-accent/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-portfolio-accent/20 to-portfolio-primary/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-portfolio-primary/10 to-portfolio-accent/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div ref={cursorRef} className="absolute w-12 h-12 pointer-events-none z-20 hidden lg:block">
        <div className="w-full h-full bg-gradient-to-r from-portfolio-primary/30 to-portfolio-accent/30 rounded-full blur-sm animate-pulse" />
      </div>

      <div ref={rippleRef} className="absolute inset-0 pointer-events-none z-10" />

      <div className="container mx-auto px-4 text-center relative z-10 mt-20">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1
            ref={headlineRef}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-tight"
          >
            I build, fix & manage modern websites.
          </h1>

          <p ref={subheadRef} className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            WordPress • Shopify • Wix — fast, reliable, and conversion-ready.
          </p>

          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-portfolio-primary to-portfolio-accent hover:from-portfolio-primary/90 hover:to-portfolio-accent/90 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
              onClick={() => scrollToSection("#contact")}
            >
              Hire Me
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-portfolio-primary/50 text-portfolio-primary hover:bg-portfolio-primary/10 px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300 bg-white/5 dark:bg-black/5 backdrop-blur-sm"
              onClick={() => scrollToSection("#projects")}
            >
              View Projects
            </Button>
          </div>

          <div ref={badgesRef} className="flex flex-wrap justify-center gap-4 mt-12">
            <Badge
              variant="secondary"
              className="px-4 py-2 text-sm font-medium bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-full flex items-center gap-2 shadow-sm backdrop-blur-sm"
            >
              <Zap className="w-4 h-4 text-portfolio-primary" />
              Fast Turnaround
            </Badge>
            <Badge
              variant="secondary"
              className="px-4 py-2 text-sm font-medium bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-full flex items-center gap-2 shadow-sm backdrop-blur-sm"
            >
              <Search className="w-4 h-4 text-portfolio-primary" />
              SEO-Friendly
            </Badge>
            <Badge
              variant="secondary"
              className="px-4 py-2 text-sm font-medium bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-full flex items-center gap-2 shadow-sm backdrop-blur-sm"
            >
              <CheckCircle className="w-4 h-4 text-portfolio-primary" />
              100+ Tasks Managed
            </Badge>
          </div>
        </div>

        <Button
          ref={scrollCueRef}
          variant="ghost"
          size="icon"
          className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-muted-foreground hover:text-foreground transition-colors bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-full border border-white/20 dark:border-white/10"
          onClick={() => scrollToSection("#services")}
          aria-label="Scroll to services section"
        >
          <ChevronDown className="w-6 h-6" />
        </Button>
      </div>
    </section>
  )
}
