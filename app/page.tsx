import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { WhyWorkWithMe } from "@/components/why-work-with-me"
import { Services } from "@/components/services"
import { Skills } from "@/components/skills"
import { Projects } from "@/components/projects"
import { WorkSamples } from "@/components/work-samples"
import { CommonQuestions } from "@/components/common-questions"
import { ProjectChecklist } from "@/components/project-checklist"
import { PricingGuide } from "@/components/pricing-guide"
import { Experience } from "@/components/experience"
import { Testimonials } from "@/components/testimonials"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { ScrollProgress } from "@/components/scroll-progress"
import { BottomDock } from "@/components/bottom-dock"

export default function HomePage() {
  return (
    <>
      <ScrollProgress />
      <Header />
      <main id="main-content" className="relative overflow-hidden">
        <div id="hero">
          <Hero />
        </div>
        <WhyWorkWithMe />
        <Services />
        <PricingGuide />
        <Skills />
        <Projects />
        <WorkSamples />
        <ProjectChecklist />
        <CommonQuestions />
        <Experience />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <BottomDock />
    </>
  )
}
