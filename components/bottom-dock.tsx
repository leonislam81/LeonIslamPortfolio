"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import { Button } from "@/components/ui/button"
import { Home, Briefcase, User, FolderOpen, MessageCircle, ChevronUp } from "lucide-react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
}

const dockItems = [
  { name: "Home", href: "#hero", id: "hero", icon: Home },
  { name: "Services", href: "#services", id: "services", icon: Briefcase },
  { name: "Skills", href: "#skills", id: "skills", icon: User },
  { name: "Projects", href: "#projects", id: "projects", icon: FolderOpen },
  { name: "Contact", href: "#contact", id: "contact", icon: MessageCircle },
]

export function BottomDock() {
  const dockRef = useRef<HTMLDivElement>(null)
  const [activeSection, setActiveSection] = useState("hero")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // Show dock after scrolling past hero
    ScrollTrigger.create({
      trigger: "#services",
      start: "top 80%",
      end: "bottom bottom",
      onEnter: () => setIsVisible(true),
      onLeaveBack: () => setIsVisible(false),
    })

    if (!prefersReducedMotion) {
      // Dock entrance animation
      gsap.from(dockRef.current, {
        y: 100,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(1.7)",
        delay: 0.5,
      })
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
    dockItems.forEach((item) => {
      const element = document.getElementById(item.id) || document.querySelector(item.href)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      observer.disconnect()
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
  }

  const scrollToTop = () => {
    gsap.to(window, {
      duration: 1.2,
      scrollTo: { y: 0 },
      ease: "power2.inOut",
    })
  }

  const handleItemHover = (index: number, isHovering: boolean) => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return

    const item = dockRef.current?.children[index]
    if (item) {
      if (isHovering) {
        gsap.to(item, {
          scale: 1.2,
          y: -8,
          duration: 0.3,
          ease: "back.out(1.7)",
        })
      } else {
        gsap.to(item, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        })
      }
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
      <div
        ref={dockRef}
        className="flex items-center gap-2 px-4 py-3 bg-background/95 backdrop-blur-md border border-border rounded-full shadow-lg"
      >
        {dockItems.map((item, index) => {
          const IconComponent = item.icon
          const isActive = activeSection === item.id

          return (
            <Button
              key={item.name}
              variant="ghost"
              size="icon"
              onClick={() => scrollToSection(item.href)}
              onMouseEnter={() => handleItemHover(index, true)}
              onMouseLeave={() => handleItemHover(index, false)}
              className={`relative w-12 h-12 rounded-full transition-colors ${
                isActive
                  ? "bg-portfolio-primary text-portfolio-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
              title={item.name}
            >
              <IconComponent className="w-5 h-5" />
              {isActive && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-portfolio-primary rounded-full" />
              )}
            </Button>
          )
        })}

        {/* Divider */}
        <div className="w-px h-6 bg-border mx-1" />

        {/* Back to top button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={scrollToTop}
          onMouseEnter={() => handleItemHover(dockItems.length, true)}
          onMouseLeave={() => handleItemHover(dockItems.length, false)}
          className="w-12 h-12 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent"
          title="Back to top"
        >
          <ChevronUp className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
