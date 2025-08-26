import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "Leon Islam - WordPress, Shopify & Wix Specialist",
  description:
    "Professional website development and management services. WordPress, Shopify, and Wix specialist offering fast turnaround, SEO-friendly solutions, and ongoing website care.",
  keywords: ["WordPress developer", "Shopify expert", "Wix designer", "website management", "bug fixing", "data entry"],
  authors: [{ name: "Leon Islam" }],
  creator: "Leon Islam",
  openGraph: {
    title: "Leon Islam - WordPress, Shopify & Wix Specialist",
    description:
      "Professional website development and management services. Fast, reliable, and conversion-ready solutions.",
    url: "https://leonislam.dev",
    siteName: "Leon Islam Portfolio",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Leon Islam - Website Development Specialist",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Leon Islam - WordPress, Shopify & Wix Specialist",
    description: "Professional website development and management services.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarnings>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Leon Islam",
              jobTitle: "Website Developer & Manager",
              description:
                "WordPress, Shopify & Wix specialist offering professional website development and management services",
              email: "leonislam810@gmail.com",
              telephone: "+8801521783498",
              url: "https://leonislam.dev",
              sameAs: ["https://wa.me/8801521783498"],
              knowsAbout: [
                "WordPress Development",
                "Shopify Store Setup",
                "Wix Design",
                "Website Management",
                "Bug Fixing",
                "Data Entry",
              ],
              "@graph": [
                {
                  "@type": "Service",
                  name: "WordPress Development & Management",
                  description: "Fast, secure WordPress sites with clean themes, SEO basics, and reliable updates",
                },
                {
                  "@type": "Service",
                  name: "Shopify Setup & Customization",
                  description: "Conversion-ready stores, theme tweaks, product setup, app integrations",
                },
                {
                  "@type": "Service",
                  name: "Wix Design & Launch",
                  description: "Modern, responsive designs delivered quickly",
                },
              ],
            }),
          }}
        />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
