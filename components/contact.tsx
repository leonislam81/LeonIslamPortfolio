"use client"

import type React from "react"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MessageSquare, Send, MapPin } from "lucide-react"
import { toast } from "sonner"
import { trackEvent } from "@/lib/analytics"
import { Turnstile } from "@/components/turnstile"


interface FormData {
  name: string
  email: string
  message: string
  service: string
  timeline: string
  platform: string
  websiteUrl: string
  budget: string
  turnstileToken: string
  sendChecklist: boolean
  honeypot: string // Hidden field for spam protection
}

const serviceOptions = [
  "Website management & updates",
  "E-commerce product listings",
  "Amazon product listing support",
  "Data entry & admin support",
  "Something else",
]

const platformOptions = [
  "WordPress",
  "Shopify",
  "Wix",
  "Amazon",
  "WooCommerce",
  "Google Sheets / Excel",
  "Other / not sure yet",
]

const budgetOptions = [
  "Under $100",
  "$100–$300",
  "$300–$750",
  "$750+",
  "I'd rather discuss first",
]

export function Contact({ headingLevel = "h2", showHomeLink = false }: { headingLevel?: "h1" | "h2"; showHomeLink?: boolean }) {
  const Heading = headingLevel
  const sectionRef = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const hasTrackedFormStart = useRef(false)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
    service: "",
    timeline: "",
    platform: "",
    websiteUrl: "",
    budget: "",
    turnstileToken: "",
    sendChecklist: false,
    honeypot: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})

  useEffect(() => {
    const requestedService = new URLSearchParams(window.location.search).get("service")
    if (requestedService && serviceOptions.includes(requestedService)) {
      setFormData((current) => ({ ...current, service: requestedService }))
    }
  }, [])

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long"
    }

    if (!formData.service) {
      newErrors.service = "Please choose the support you need"
    }

    if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !formData.turnstileToken) {
      newErrors.turnstileToken = "Please complete the security check"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check honeypot for spam
    if (formData.honeypot) {
      return // Silent fail for bots
    }

    if (!validateForm()) {
      toast.error("Please complete the required fields", {
        description: "Check the highlighted fields and try again.",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          service: formData.service,
          timeline: formData.timeline,
          platform: formData.platform,
          websiteUrl: formData.websiteUrl,
          budget: formData.budget,
          turnstileToken: formData.turnstileToken,
          sendChecklist: formData.sendChecklist,
          honeypot: formData.honeypot,
        }),
      })
      const result = await response.json().catch(() => null) as { checklistSent?: boolean } | null

      if (response.ok) {
        trackEvent("generate_lead", {
          event_category: "contact",
          service_interest: formData.service,
          lead_source: "contact_form",
        })
        // Success animation
        toast.success("Message sent successfully!", {
          description: formData.sendChecklist && result?.checklistSent === false
            ? "Your message was sent, but the checklist could not be delivered. I'll get back to you within 2–4 business hours."
            : formData.sendChecklist
              ? "Your project checklist is on its way, and I'll get back to you within 2–4 business hours."
              : "I'll get back to you within 2–4 business hours.",
        })

        // Reset form
        setFormData({
          name: "",
          email: "",
          message: "",
          service: "",
          timeline: "",
          platform: "",
          websiteUrl: "",
          budget: "",
          turnstileToken: "",
          sendChecklist: false,
          honeypot: "",
        })
        setErrors({})
      } else {
        throw new Error("Failed to send message")
      }
    } catch (error) {
      toast.error("Unable to send your message", {
        description: "Please try again or contact me directly by email or WhatsApp.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleFormStart = () => {
    if (hasTrackedFormStart.current) return

    hasTrackedFormStart.current = true
    trackEvent("quote_form_start", {
      event_category: "contact",
      form_name: "request_quote",
    })
  }

  const handleServiceChange = (service: string) => {
    handleInputChange("service", service)
    if (service) {
      trackEvent("quote_service_selected", {
        event_category: "contact",
        service_interest: service,
      })
    }
  }

  const handleTurnstileVerify = useCallback((token: string) => {
    setFormData((current) => ({ ...current, turnstileToken: token }))
    setErrors((current) => ({ ...current, turnstileToken: undefined }))
  }, [])

  const handleTurnstileExpire = useCallback(() => {
    setFormData((current) => ({ ...current, turnstileToken: "" }))
  }, [])

  const openWhatsApp = () => {
    trackEvent("contact_whatsapp_click", { event_category: "contact", contact_method: "whatsapp" })
    const message = encodeURIComponent("Hi Leon! I'm interested in your website services.")
    window.open(`https://wa.me/8801521783498?text=${message}`, "_blank")
  }

  const openEmail = () => {
    trackEvent("contact_email_click", { event_category: "contact", contact_method: "email" })
    const subject = encodeURIComponent("Website Project Inquiry")
    const body = encodeURIComponent(
      "Hi Leon,\n\nI'm interested in discussing a website project with you.\n\nBest regards,",
    )
    window.open(`mailto:leonislam810@gmail.com?subject=${subject}&body=${body}`, "_blank")
  }

  return (
    <section id="contact" ref={sectionRef} className="relative overflow-hidden bg-slate-50 py-20 sm:py-28 dark:bg-slate-950">
      <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-sky-100/70 to-transparent dark:from-sky-950/30" />
      <div className="container mx-auto px-4">
        <div className="relative mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          {showHomeLink && <Link href="/" className="mb-6 inline-flex text-sm font-medium text-portfolio-primary hover:underline">← Back to home</Link>}
          <span className="inline-flex items-center rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[.16em] text-sky-700 shadow-sm dark:border-sky-900 dark:bg-slate-900 dark:text-sky-300">Let’s work together</span>
          <Heading className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Get a clear quote for the support you need
          </Heading>
          <p className="mt-4 text-lg text-muted-foreground">
            Need website updates, product listing support, Amazon catalog help, or reliable data and admin assistance? Send the details and I’ll reply with the best next step.
          </p>
        </div>

        <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_.9fr]">
          {/* Contact Form */}
          <Card className="rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            <CardHeader className="p-6 pb-2 sm:p-8 sm:pb-3">
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5 text-portfolio-primary" />
                Request a Quote
              </CardTitle>
              <CardDescription>Choose the support you need, then share your task, timeline, and any useful links.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-4 sm:p-8 sm:pt-5">
              <form ref={formRef} onSubmit={handleSubmit} onFocusCapture={handleFormStart} className="space-y-6">
                {/* Honeypot field (hidden) */}
                <input
                  type="text"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={(e) => handleInputChange("honeypot", e.target.value)}
                  style={{ display: "none" }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="form-field space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">
                    Name *
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`h-12 rounded-xl bg-slate-50 dark:bg-slate-950 ${errors.name ? "border-destructive" : "border-slate-200 dark:border-slate-700 focus-visible:ring-portfolio-primary"}`}
                    placeholder="Your full name"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && <p id="name-error" className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="form-field space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`h-12 rounded-xl bg-slate-50 dark:bg-slate-950 ${errors.email ? "border-destructive" : "border-slate-200 dark:border-slate-700 focus-visible:ring-portfolio-primary"}`}
                    placeholder="your.email@example.com"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && <p id="email-error" className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="form-field space-y-2">
                    <label htmlFor="service" className="text-sm font-medium text-foreground">
                      Support needed *
                    </label>
                    <select
                      id="service"
                      value={formData.service}
                      onChange={(e) => handleServiceChange(e.target.value)}
                      className={`flex h-12 w-full rounded-xl border bg-slate-50 px-3 py-2 text-sm text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-portfolio-primary dark:bg-slate-950 ${errors.service ? "border-destructive" : "border-slate-200 dark:border-slate-700"}`}
                      aria-invalid={Boolean(errors.service)}
                      aria-describedby={errors.service ? "service-error" : undefined}
                    >
                      <option value="">Choose a service</option>
                      {serviceOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                    {errors.service && <p id="service-error" className="text-sm text-destructive">{errors.service}</p>}
                  </div>

                  <div className="form-field space-y-2">
                    <label htmlFor="timeline" className="text-sm font-medium text-foreground">
                      Preferred timeline
                    </label>
                    <select
                      id="timeline"
                      value={formData.timeline}
                      onChange={(e) => handleInputChange("timeline", e.target.value)}
                      className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-portfolio-primary dark:border-slate-700 dark:bg-slate-950"
                    >
                      <option value="">Select a timeline</option>
                      <option value="As soon as possible">As soon as possible</option>
                      <option value="Within 1 week">Within 1 week</option>
                      <option value="Within 2-4 weeks">Within 2-4 weeks</option>
                      <option value="Flexible / planning ahead">Flexible / planning ahead</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="form-field space-y-2">
                    <label htmlFor="platform" className="text-sm font-medium text-foreground">Platform or tool <span className="text-muted-foreground">(optional)</span></label>
                    <select id="platform" value={formData.platform} onChange={(e) => handleInputChange("platform", e.target.value)} className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-portfolio-primary dark:border-slate-700 dark:bg-slate-950">
                      <option value="">Choose a platform</option>
                      {platformOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </div>

                  <div className="form-field space-y-2">
                    <label htmlFor="budget" className="text-sm font-medium text-foreground">Estimated budget <span className="text-muted-foreground">(optional)</span></label>
                    <select id="budget" value={formData.budget} onChange={(e) => handleInputChange("budget", e.target.value)} className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-portfolio-primary dark:border-slate-700 dark:bg-slate-950">
                      <option value="">Choose a range</option>
                      {budgetOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-field space-y-2">
                  <label htmlFor="websiteUrl" className="text-sm font-medium text-foreground">Website, store, or file link <span className="text-muted-foreground">(optional)</span></label>
                  <Input id="websiteUrl" type="url" value={formData.websiteUrl} onChange={(e) => handleInputChange("websiteUrl", e.target.value)} className="h-12 rounded-xl border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-950" placeholder="https://example.com" />
                  <p className="text-xs leading-5 text-muted-foreground">Share a link if it helps explain the work. You can also include links in your message.</p>
                </div>

                <div className="form-field space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-foreground">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    className={`min-h-[140px] rounded-xl bg-slate-50 dark:bg-slate-950 ${errors.message ? "border-destructive" : "border-slate-200 dark:border-slate-700 focus-visible:ring-portfolio-primary"}`}
                    placeholder="Tell me about your website, e-commerce, Amazon, data entry, or admin support needs..."
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "message-error" : undefined}
                  />
                  {errors.message && <p id="message-error" className="text-sm text-destructive">{errors.message}</p>}
                </div>

                <div className="form-field flex items-center space-x-2">
                  <Checkbox
                    id="checklist"
                    checked={formData.sendChecklist}
                    onCheckedChange={(checked) => handleInputChange("sendChecklist", checked as boolean)}
                  />
                  <label htmlFor="checklist" className="text-sm text-muted-foreground">
                    Send me a project checklist to help prepare for our discussion
                  </label>
                </div>

                <div className="space-y-2">
                  <Turnstile
                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                    onVerify={handleTurnstileVerify}
                    onExpire={handleTurnstileExpire}
                  />
                  {errors.turnstileToken && <p className="text-sm text-destructive">{errors.turnstileToken}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 w-full rounded-xl bg-portfolio-primary text-portfolio-primary-foreground shadow-lg shadow-sky-700/20 hover:bg-portfolio-primary/90"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Request My Quote
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-5">
            <Card className="rounded-3xl border border-portfolio-primary/20 bg-white text-foreground shadow-sm dark:border-portfolio-primary/25 dark:bg-gradient-to-br dark:from-[#101b35] dark:via-[#15294a] dark:to-[#123d4c] dark:text-white dark:shadow-xl dark:shadow-slate-950/25">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-portfolio-primary dark:text-cyan-300" />
                  Email Me Directly
                </CardTitle>
                <CardDescription className="text-muted-foreground dark:text-sky-100/75">Prefer email? Send me a message directly.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  onClick={openEmail}
                  className="w-full justify-start border-portfolio-primary/25 bg-portfolio-primary/5 text-portfolio-primary shadow-sm hover:bg-portfolio-primary/10 hover:text-portfolio-primary dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:hover:text-white"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  leonislam810@gmail.com
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-portfolio-primary" />
                  WhatsApp Chat
                </CardTitle>
                <CardDescription>Quick questions? Let's chat on WhatsApp.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  onClick={openWhatsApp}
                  className="w-full justify-start border-green-500/30 text-green-600 hover:bg-green-500/10 bg-transparent"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  +880 1521 783498
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-portfolio-primary" />
                  Location & Availability
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Based in Bangladesh</p>
                  <p className="text-sm text-muted-foreground">Working with clients worldwide</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Response Time</p>
                  <p className="text-sm text-muted-foreground">Usually within 2-4 hours during business days</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Availability</p>
                  <p className="text-sm text-muted-foreground">Monday - Saturday, 9 AM - 8 PM (GMT+6)</p>
                </div>
              </CardContent>
            </Card>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs font-semibold uppercase tracking-[.16em] text-portfolio-primary">Simple process</p>
              <h3 className="mt-2 text-xl font-semibold text-foreground">What happens after you enquire?</h3>
              <ol className="mt-6 space-y-5">
                {[
                  ["01", "Send the details", "Share the task, relevant links or files, and your ideal timeline."],
                  ["02", "Get a clear next step", "I&apos;ll review the request and confirm the scope, priorities, and practical approach."],
                  ["03", "Work moves forward", "You&apos;ll receive organized progress updates while the agreed work is completed."],
                  ["04", "Review and handover", "Receive completed work, a clear summary, and any useful next steps for ongoing support."],
                ].map(([number, title, description]) => (
                  <li key={number} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-portfolio-primary/10 text-xs font-bold text-portfolio-primary">{number}</span>
                    <div><p className="text-sm font-semibold text-foreground">{title}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p></div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
