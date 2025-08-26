"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Mail, Phone, MessageSquare, CheckCircle, Send, MapPin } from "lucide-react"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface FormData {
  name: string
  email: string
  message: string
  sendChecklist: boolean
  honeypot: string // Hidden field for spam protection
}

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const contactInfoRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
    sendChecklist: false,
    honeypot: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (!prefersReducedMotion && sectionRef.current) {
      // Title animation
      gsap.from(titleRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      })

      // Form fields slide in
      gsap.from(formRef.current?.querySelectorAll(".form-field") || [], {
        x: -30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: formRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      })

      // Contact info animation
      gsap.from(contactInfoRef.current?.children || [], {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: contactInfoRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      })
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
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form and try again.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate form submission (replace with actual Formspree/EmailJS integration)
      const response = await fetch("https://formspree.io/f/your-form-id", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          sendChecklist: formData.sendChecklist,
        }),
      })

      if (response.ok) {
        // Success animation
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        if (!prefersReducedMotion) {
          // Animate success checkmark
          const successIcon = document.querySelector(".success-checkmark")
          if (successIcon) {
            gsap.fromTo(
              successIcon,
              { scale: 0, rotation: -180 },
              { scale: 1, rotation: 0, duration: 0.5, ease: "back.out(1.2)" },
            )
          }
        }

        toast({
          title: "Message Sent Successfully!",
          description: "Thank you for reaching out. I'll get back to you within 24 hours.",
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
      toast({
        title: "Error Sending Message",
        description: "Please try again or contact me directly via email or WhatsApp.",
        variant: "destructive",
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
    <section id="contact" ref={sectionRef} className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 ref={titleRef} className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Let's Work Together
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ready to build, fix, or manage your website? Get in touch and let's discuss your project.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="border border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5 text-portfolio-primary" />
                Send a Message
              </CardTitle>
              <CardDescription>Fill out the form below and I'll get back to you within 24 hours.</CardDescription>
            </CardHeader>
            <CardContent>
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
                    className={errors.name ? "border-destructive" : ""}
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
                    className={errors.email ? "border-destructive" : ""}
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
                    className={`min-h-[120px] ${errors.message ? "border-destructive" : ""}`}
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
                  className="w-full bg-portfolio-primary hover:bg-portfolio-primary/90 text-portfolio-primary-foreground"
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
                  <CheckCircle className="success-checkmark w-4 h-4 ml-2 opacity-0" />
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div ref={contactInfoRef} className="space-y-6">
            <Card className="border border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-portfolio-primary" />
                  Email Me Directly
                </CardTitle>
                <CardDescription>Prefer email? Send me a message directly.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  onClick={openEmail}
                  className="w-full justify-start border-portfolio-primary/30 text-portfolio-primary hover:bg-portfolio-primary/10 bg-transparent"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  leonislam810@gmail.com
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-border bg-card">
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

            <Card className="border border-border bg-card">
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

            <div className="bg-muted/50 p-6 rounded-lg">
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
