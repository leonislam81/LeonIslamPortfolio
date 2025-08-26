"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, Heart } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: "Services", href: "#services" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Experience", href: "#experience" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "#contact" },
  ]

  const services = [
    "WordPress Development",
    "Shopify Setup",
    "Wix Design",
    "Data Entry",
    "Bug Fixing",
    "Website Management",
  ]

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const openWhatsApp = () => {
    const message = encodeURIComponent("Hi Leon! I'm interested in your website services.")
    window.open(`https://wa.me/8801521783498?text=${message}`, "_blank")
  }

  const openEmail = () => {
    const subject = encodeURIComponent("Website Project Inquiry")
    window.open(`mailto:leonislam810@gmail.com?subject=${subject}`, "_blank")
  }

  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold text-foreground mb-4">Leon Islam</h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              WordPress, Shopify & Wix specialist delivering fast, reliable, and conversion-ready websites for
              businesses worldwide.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                WordPress Expert
              </Badge>
              <Badge variant="outline" className="text-xs">
                Shopify Specialist
              </Badge>
              <Badge variant="outline" className="text-xs">
                Wix Designer
              </Badge>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-muted-foreground hover:text-portfolio-primary transition-colors text-sm"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Services</h4>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service} className="text-muted-foreground text-sm">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Get In Touch</h4>
            <div className="space-y-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={openEmail}
                className="justify-start p-0 h-auto text-muted-foreground hover:text-portfolio-primary"
              >
                <Mail className="w-4 h-4 mr-2" />
                leonislam810@gmail.com
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={openWhatsApp}
                className="justify-start p-0 h-auto text-muted-foreground hover:text-green-600"
              >
                <Phone className="w-4 h-4 mr-2" />
                +880 1521 783498
              </Button>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4" />
                <span>Bangladesh (Working Globally)</span>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-2">Response Time</p>
              <p className="text-sm font-medium text-foreground">Usually within 2-4 hours</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>© {currentYear} Leon Islam. All rights reserved.</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                Built with <Heart className="w-3 h-3 text-red-500 fill-current" /> and expertise
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Fast Turnaround</span>
              <span>•</span>
              <span>SEO-Friendly</span>
              <span>•</span>
              <span>100+ Tasks Managed</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
