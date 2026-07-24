"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MessageSquare, CheckCircle, Send, MapPin } from "lucide-react"
import { toast } from "sonner"


interface FormData {
  name: string
  email: string
  message: string
  sendChecklist: boolean
  honeypot: string // Hidden field for spam protection
}

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
    sendChecklist: false,
    honeypot: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})

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
      const response = await fetch("https://formsubmit.co/ajax/leonislam810@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          "Send project checklist": formData.sendChecklist ? "Yes" : "No",
          _subject: "New portfolio contact form message",
          _replyto: formData.email,
          _template: "table",
        }),
      })

      if (response.ok) {
        // Success animation
        toast.success("Message sent successfully!", {
          description: "I'll get back to you within 24 hours.",
        })

        // Reset form
        setFormData({
          name: "",
          email: "",
          message: "",
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

  const openWhatsApp = () => {
    const message = encodeURIComponent("Hi Leon! I'm interested in your website services.")
    window.open(`https://wa.me/8801521783498?text=${message}`, "_blank")
  }

  const openEmail = () => {
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
          <span className="inline-flex items-center rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[.16em] text-sky-700 shadow-sm dark:border-sky-900 dark:bg-slate-900 dark:text-sky-300">Start a project</span>
          <h2 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Let's Work Together
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Ready to build, fix, or manage your website? Get in touch and let's discuss your project.
          </p>
        </div>

        <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_.9fr]">
          {/* Contact Form */}
          <Card className="rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            <CardHeader className="p-6 pb-2 sm:p-8 sm:pb-3">
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5 text-portfolio-primary" />
                Send a Message
              </CardTitle>
              <CardDescription>Fill out the form below and I'll get back to you within 24 hours.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-4 sm:p-8 sm:pt-5">
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
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
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
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
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
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
                    placeholder="Tell me about your project, timeline, and any specific requirements..."
                  />
                  {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
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
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-5">
            <Card className="rounded-3xl border border-sky-300/30 bg-gradient-to-br from-[#0b1f3a] via-[#0c3150] to-[#0a4b5c] p-1 text-white shadow-xl shadow-sky-950/25 dark:border-cyan-300/15">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-sky-300" />
                  Email Me Directly
                </CardTitle>
                <CardDescription className="text-sky-100/75">Prefer email? Send me a message directly.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  onClick={openEmail}
                  className="w-full justify-start border-white/20 bg-white/10 text-white shadow-sm hover:bg-white/20 hover:text-white"
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
              <h3 className="font-semibold text-foreground mb-3">What happens next?</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-portfolio-primary flex-shrink-0" />
                  <span>I'll review your project details within 24 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-portfolio-primary flex-shrink-0" />
                  <span>We'll schedule a call to discuss your requirements</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-portfolio-primary flex-shrink-0" />
                  <span>I'll provide a detailed proposal and timeline</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-portfolio-primary flex-shrink-0" />
                  <span>We'll start building your amazing website!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
