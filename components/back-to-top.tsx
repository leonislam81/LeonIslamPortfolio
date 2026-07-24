"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import { Button } from "@/components/ui/button"
import { ArrowUp } from "lucide-react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollToPlugin)
}

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  useEffect(() => {
    if (buttonRef.current) {
      if (isVisible) {
        gsap.to(buttonRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "back.out(1.2)",
        })
      } else {
        gsap.to(buttonRef.current, {
          opacity: 0,
          scale: 0.8,
          duration: 0.3,
          ease: "power2.out",
        })
      }
    }
  }, [isVisible])

  const scrollToTop = () => {
    gsap.to(window, {
      duration: 1,
      scrollTo: { y: 0 },
      ease: "power2.inOut",
    })
  }

  return (
    <Button
      ref={buttonRef}
      onClick={scrollToTop}
      size="icon"
      className="fixed bottom-6 right-4 w-10 h-10 rounded-full bg-portfolio-primary hover:bg-portfolio-primary/90 text-portfolio-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 scale-75 z-40 sm:bottom-8 sm:right-8 sm:w-12 sm:h-12"
      aria-label="Back to top"
    >
      <ArrowUp className="w-5 h-5" />
    </Button>
  )
}
