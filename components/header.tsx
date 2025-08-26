"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X, Code, Zap } from "lucide-react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
}

const navItems = [
  { name: "Home", href: "#hero", id: "hero" },
  { name: "Services", href: "#services", id: "services" },
  { name: "Skills", href: "#skills", id: "skills" },
  { name: "Projects", href: "#projects", id: "projects" },
  { name: "Experience", href: "#experience", id: "experience" },
  { name: "Testimonials", href: "#testimonials", id: "testimonials" },
  { name: "Contact", href: "#contact", id: "contact" },
]

export function Header() {
  const headerRef = useRef<HTMLElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const [activeSection, setActiveSection] = useState("hero")
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (!prefersReducedMotion) {
      gsap.fromTo(
        headerRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.2 },
      )

      // Header scroll effects
      ScrollTrigger.create({
        trigger: "body",
        start: "100px top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const scrolled = self.progress > 0
          setIsScrolled(scrolled)

          if (headerRef.current) {
            if (scrolled) {
              gsap.to(headerRef.current, {
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                boxShadow: "0 2px 20px rgba(0, 0, 0, 0.1)",
                duration: 0.3,
                ease: "power2.out",
              })
            } else {
              gsap.to(headerRef.current, {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(5px)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
                duration: 0.3,
                ease: "power2.out",
              })
            }
          }
        },
      })
    } else {
      if (headerRef.current) {
        gsap.set(headerRef.current, { opacity: 1, y: 0 })
      }
    }

    // Scroll spy for active section highlighting
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id || "hero"
          setActiveSection(sectionId)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    // Observe all sections
    navItems.forEach((item) => {
      const element = document.getElementById(item.id) || document.querySelector(item.href)
      if (element) {
        observer.observe(element)
      }
    })

    // Handle scroll for isScrolled state
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", handleScroll)
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href) || document.querySelector("#hero")
    if (element) {
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: element, offsetY: 80 },
        ease: "power2.inOut",
      })
    }
    setIsMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (!isMobileMenuOpen) {
      setIsMobileMenuOpen(true)
      document.body.style.overflow = "hidden"

      if (!prefersReducedMotion && mobileMenuRef.current) {
        gsap.fromTo(mobileMenuRef.current, { x: "100%" }, { x: "0%", duration: 0.3, ease: "power2.out" })
        gsap.from(mobileMenuRef.current.querySelectorAll(".mobile-nav-item"), {
          x: 50,
          opacity: 0,
          duration: 0.4,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.1,
        })
      }
    } else {
      if (!prefersReducedMotion && mobileMenuRef.current) {
        gsap.to(mobileMenuRef.current, {
          x: "100%",
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            setIsMobileMenuOpen(false)
            document.body.style.overflow = "auto"
          },
        })
      } else {
        setIsMobileMenuOpen(false)
        document.body.style.overflow = "auto"
      }
    }
  }

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.1)",
          backdropFilter: isScrolled ? "blur(10px)" : "blur(5px)",
          borderBottom: isScrolled ? "1px solid rgba(0, 0, 0, 0.1)" : "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: isScrolled ? "0 2px 20px rgba(0, 0, 0, 0.1)" : "0 2px 10px rgba(0, 0, 0, 0.05)",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div ref={logoRef} className="flex items-center gap-2">
              <div className="w-8 h-8 bg-portfolio-primary rounded-lg flex items-center justify-center shadow-lg">
                <Code className="w-5 h-5 text-portfolio-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <div className="font-bold text-lg text-foreground">Leon Islam</div>
                <div className="text-xs text-muted-foreground -mt-1">Website Specialist</div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  size="sm"
                  onClick={() => scrollToSection(item.href)}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? "text-portfolio-primary bg-portfolio-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {item.name}
                  {activeSection === item.id && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-portfolio-primary rounded-full" />
                  )}
                </Button>
              ))}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              <ThemeToggle />

              {/* CTA Button - Desktop */}
              <Button
                size="sm"
                onClick={() => scrollToSection("#contact")}
                className="hidden md:flex bg-portfolio-primary hover:bg-portfolio-primary/90 text-portfolio-primary-foreground"
              >
                <Zap className="w-4 h-4 mr-1" />
                Hire Me
              </Button>

              {/* Mobile menu button */}
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu} aria-label="Toggle mobile menu">
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" onClick={toggleMobileMenu} />
      )}

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-background border-l border-border z-50 md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-out`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-portfolio-primary rounded-md flex items-center justify-center">
              <Code className="w-4 h-4 text-portfolio-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">Leon Islam</span>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu} aria-label="Close mobile menu">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-4">
          <div className="space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                onClick={() => scrollToSection(item.href)}
                className={`mobile-nav-item w-full justify-start text-left ${
                  activeSection === item.id
                    ? "text-portfolio-primary bg-portfolio-primary/10"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.name}
                {activeSection === item.id && <div className="ml-auto w-2 h-2 bg-portfolio-primary rounded-full" />}
              </Button>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-border">
            <Button
              onClick={() => scrollToSection("#contact")}
              className="mobile-nav-item w-full bg-portfolio-primary hover:bg-portfolio-primary/90 text-portfolio-primary-foreground"
            >
              <Zap className="w-4 h-4 mr-2" />
              Hire Me
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground mb-2">Ready to work together?</p>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open("mailto:leonislam810@gmail.com", "_blank")}
                className="mobile-nav-item w-full text-xs"
              >
                leonislam810@gmail.com
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open("https://wa.me/8801521783498", "_blank")}
                className="mobile-nav-item w-full text-xs"
              >
                +880 1521 783498
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
