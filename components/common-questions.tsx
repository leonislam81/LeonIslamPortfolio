import Link from "next/link"
import { ArrowRight, HelpCircle } from "lucide-react"

const questions = [
  {
    question: "Can I start with one small task?",
    answer: "Yes. You can send a focused website update, product-listing task, research request, or data job. If the work grows into a larger project or recurring support, the next step can be planned from there.",
  },
  {
    question: "How is pricing worked out?",
    answer: "Pricing is based on the scope, source material, platform, urgency, and whether the work is a one-time task or recurring support. Share the details and you will receive a clear recommendation before work begins.",
  },
  {
    question: "What do you need before starting?",
    answer: "A short description of the outcome you want, the relevant website or files, any deadline, and an example where useful. You do not need to have everything prepared before getting in touch.",
  },
  {
    question: "How do you handle website or store access?",
    answer: "Access is requested only when it is needed for the task, using your preferred secure method. You can also start by sharing a task list, screenshots, links, or files before sharing any access.",
  },
]

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: questions.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
}

export function CommonQuestions() {
  return (
    <section id="faq" className="border-y border-border bg-muted/25 py-20 sm:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-portfolio-primary/20 bg-card px-3 py-1 text-sm font-medium text-portfolio-primary shadow-sm"><HelpCircle className="h-4 w-4" /> Common questions</span>
          <h2 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">A few helpful details before you get started.</h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">If you are not sure which service or level of support fits, send what you know and the next step can be worked out together.</p>
        </div>
        <div className="mx-auto mt-12 max-w-4xl divide-y divide-border overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
          {questions.map(({ question, answer }) => (
            <details key={question} className="group p-6 sm:p-7">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold text-foreground marker:content-none">
                {question}<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-portfolio-primary/10 text-xl font-normal text-portfolio-primary transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="max-w-3xl pt-4 text-sm leading-7 text-muted-foreground">{answer}</p>
            </details>
          ))}
        </div>
        <div className="mt-8 text-center"><Link href="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-portfolio-primary hover:text-portfolio-accent">Still have a question? Send a quick message <ArrowRight className="h-4 w-4" /></Link></div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </section>
  )
}
