"use client"

import { useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { WhyWorkWithMe } from "@/components/why-work-with-me"
import { Services } from "@/components/services"
import { Skills } from "@/components/skills"
import { Projects } from "@/components/projects"
import { WorkSamples } from "@/components/work-samples"
import { Experience } from "@/components/experience"
import { Testimonials } from "@/components/testimonials"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { ScrollProgress } from "@/components/scroll-progress"
import { BottomDock } from "@/components/bottom-dock"

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
}

export default function HomePage() {
  const mainRef = useRef<HTMLElement>(null)

  return (
    <>
      <ScrollProgress />
      <Header />
      <main id="main-content" ref={mainRef} className="relative overflow-hidden">
        <div id="hero">
          <Hero />
        </div>
        <WhyWorkWithMe />
        <Services />
        <Skills />
        <Projects />
        <WorkSamples />
        <Experience />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <BottomDock />
    </>
  )
}
