"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Languages, Menu, X, Code, Zap } from "lucide-react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollToPlugin)
}

const navItems = [
  { name: "Home", href: "#hero", id: "hero" },
  { name: "Services", href: "#services", id: "services" },
  { name: "Capabilities", href: "#skills", id: "skills" },
  { name: "Support", href: "#projects", id: "projects" },
  { name: "Platforms", href: "#experience", id: "experience" },
  { name: "Process", href: "#testimonials", id: "testimonials" },
  { name: "Contact", href: "#contact", id: "contact" },
]

const languages = [
  ['en', 'English'], ['bn', 'বাংলা'], ['hr', 'Hrvatski'], ['nl', 'Nederlands'],
  ['fr', 'Français'], ['de', 'Deutsch'], ['es', 'Español'], ['it', 'Italiano'],
  ['hi', 'हिन्दी'], ['ta', 'தமிழ்'], ['te', 'తెలుగు'], ['mr', 'मराठी'],
  ['gu', 'ગુજરાતી'], ['pa', 'ਪੰਜਾਬੀ'], ['kn', 'ಕನ್ನಡ'], ['ml', 'മലയാളം'], ['ur', 'اردو'],
  ['ar', 'العربية'], ['pt', 'Português'], ['tr', 'Türkçe'], ['pl', 'Polski'],
  ['ru', 'Русский'], ['uk', 'Українська'], ['zh-CN', '中文'], ['ja', '日本語'], ['ko', '한국어'],
  ['vi', 'Tiếng Việt'], ['id', 'Bahasa Indonesia'], ['th', 'ไทย'], ['el', 'Ελληνικά'],
  ['ro', 'Română'], ['hu', 'Magyar'], ['cs', 'Čeština'], ['sv', 'Svenska'], ['da', 'Dansk'],
  ['no', 'Norsk'], ['fi', 'Suomi'],
] as const

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
    }
  }, [])

  useEffect(() => {
    if (!isMobileMenuOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") toggleMobileMenu()
    }

    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [isMobileMenuOpen])

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href) || document.querySelector("#hero")
    if (element) {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        element.scrollIntoView({ behavior: "auto", block: "start" })
      } else {
        gsap.to(window, {
          duration: 1,
          scrollTo: { y: element, offsetY: 80 },
          ease: "power2.inOut",
        })
      }
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

  const translatePage = (language: string) => {
    const currentUrl = window.location.href
    window.location.assign(`https://translate.google.com/translate?sl=auto&tl=${language}&u=${encodeURIComponent(currentUrl)}`)
  }

  return (
    <>
      <header
        ref={headerRef}
        className={`sticky top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${isScrolled ? "border-slate-200/80 bg-white/90 shadow-lg shadow-slate-900/5 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/90" : "border-transparent bg-white/70 backdrop-blur-md dark:bg-slate-950/70"}`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div ref={logoRef} className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 shadow-lg shadow-sky-500/25">
                <Code className="w-5 h-5 text-portfolio-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <div className="font-bold text-lg tracking-tight text-foreground">Leon Islam</div>
                <div className="-mt-1 text-xs text-muted-foreground">Digital specialist</div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav aria-label="Main navigation" className="hidden items-center gap-1 rounded-full border border-slate-200/80 bg-white/70 p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 md:flex">
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  size="sm"
                  onClick={() => scrollToSection(item.href)}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? "rounded-full text-portfolio-primary bg-portfolio-primary/10"
                      : "rounded-full text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {item.name}
                  {activeSection === item.id && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-portfolio-primary rounded-full" />
                  )}
                </Button>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              <ThemeToggle />

              <details className="relative hidden md:block">
                <summary className="flex h-9 cursor-pointer list-none items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 text-sm font-medium text-slate-700 shadow-sm transition hover:border-portfolio-primary/30 hover:text-portfolio-primary dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-200">
                  <Languages className="h-4 w-4" /> <span>English</span>
                </summary>
                <div className="absolute right-0 top-11 z-50 w-72 overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-xl shadow-slate-950/15">
                  <p className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-[.14em] text-muted-foreground">Choose language</p>
                  <div className="grid max-h-72 grid-cols-2 gap-1 overflow-y-auto">
                    {languages.map(([code, name]) => (
                      <button key={code} type="button" onClick={() => code === 'en' ? undefined : translatePage(code)} className={`rounded-xl px-3 py-2 text-left text-sm transition hover:bg-portfolio-primary/10 hover:text-portfolio-primary ${code === 'en' ? 'bg-portfolio-primary/10 font-semibold text-portfolio-primary' : 'text-foreground'}`}>
                        {name}
                      </button>
                    ))}
                  </div>
                  <p className="px-3 pb-1 pt-2 text-xs leading-4 text-muted-foreground">Translation is provided by Google Translate. English is the original site.</p>
                </div>
              </details>

              {/* CTA Button - Desktop */}
              <Button
                size="sm"
                onClick={() => scrollToSection("#contact")}
                className="hidden rounded-full bg-portfolio-primary px-4 shadow-md shadow-sky-500/20 hover:bg-portfolio-primary/90 md:flex"
              >
                <Zap className="w-4 h-4 mr-1" />
                Hire Me
              </Button>

              {/* Mobile menu button */}
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu} aria-label="Toggle mobile menu" aria-expanded={isMobileMenuOpen} aria-controls="mobile-navigation" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" onClick={toggleMobileMenu} aria-hidden="true" />
      )}

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        id="mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        aria-hidden={!isMobileMenuOpen}
        inert={!isMobileMenuOpen}
        className={`fixed top-0 right-0 h-full w-full overflow-y-auto border-l border-slate-200 bg-white text-slate-900 shadow-2xl shadow-slate-950/20 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 z-50 sm:w-80 md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-out`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-portfolio-primary rounded-md flex items-center justify-center">
              <Code className="w-4 h-4 text-portfolio-primary-foreground" />
            </div>
            <span className="font-semibold text-slate-900 dark:text-slate-100">Leon Islam</span>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu} aria-label="Close mobile menu" className="text-slate-900 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-100 dark:hover:bg-slate-900 dark:hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-4">
          <details className="mb-5 rounded-2xl border border-border bg-card p-3">
            <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-foreground"><Languages className="h-4 w-4 text-portfolio-primary" /> Language: English</summary>
            <div className="mt-3 grid max-h-52 grid-cols-2 gap-1 overflow-y-auto">
              {languages.map(([code, name]) => <button key={code} type="button" onClick={() => code === 'en' ? undefined : translatePage(code)} className={`rounded-lg px-2 py-2 text-left text-sm transition hover:bg-portfolio-primary/10 hover:text-portfolio-primary ${code === 'en' ? 'bg-portfolio-primary/10 font-semibold text-portfolio-primary' : 'text-foreground'}`}>{name}</button>)}
            </div>
          </details>
          <div className="space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                onClick={() => scrollToSection(item.href)}
                className={`mobile-nav-item !opacity-100 w-full justify-start text-left ${
                  activeSection === item.id
                    ? "bg-portfolio-primary/10 text-portfolio-primary"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                }`}
              >
                {item.name}
                {activeSection === item.id && <div className="ml-auto w-2 h-2 bg-portfolio-primary rounded-full" />}
              </Button>
            ))}
          </div>

          <div className="mt-8 border-t border-slate-200 pt-8 dark:border-slate-800">
            <Button
              onClick={() => scrollToSection("#contact")}
              className="mobile-nav-item !opacity-100 w-full bg-portfolio-primary hover:bg-portfolio-primary/90 text-portfolio-primary-foreground"
            >
              <Zap className="w-4 h-4 mr-2" />
              Hire Me
            </Button>
          </div>

          <div className="mt-6 border-t border-slate-200 pt-6 text-center dark:border-slate-800">
            <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">Ready to work together?</p>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open("mailto:info@leonislam.com", "_blank")}
                className="mobile-nav-item !opacity-100 w-full border-slate-300 bg-white text-slate-700 text-xs hover:bg-slate-100 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                info@leonislam.com
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open("https://wa.me/8801521783498", "_blank")}
                className="mobile-nav-item !opacity-100 w-full border-slate-300 bg-white text-slate-700 text-xs hover:bg-slate-100 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white"
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
