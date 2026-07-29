import type React from 'react';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';
import { PublicSiteOverlays } from '@/components/public-site-overlays';
import './globals.css';

const GOOGLE_ANALYTICS_ID = 'G-CGT7461XKJ';

export const viewport = {
  themeColor: '#4338ca',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://leonislam.com'),
  title: {
    default: 'Leon Islam | Website, E-commerce & Admin Support',
    template: '%s | Leon Islam',
  },
  description:
    'Website, e-commerce, Amazon, data entry, and admin support services. Get reliable help with website updates, product listings, catalog data, and online operations.',
  keywords: [
    'WordPress developer',
    'Shopify expert',
    'Wix designer',
    'website management',
    'bug fixing',
    'data entry',
    'Amazon product listing',
    'e-commerce product listing',
    'website admin support',
    'virtual assistant',
  ],
  authors: [{ name: 'Leon Islam' }],
  creator: 'Leon Islam',
  alternates: {
    canonical: '/',
  },
  manifest: '/manifest.webmanifest',
  verification: {
    google: 'JbwwISQ3UzURbldzLyuAK0i_VA0zlPgn8x64myPLI3s',
  },
  openGraph: {
    title: 'Leon Islam - Website, E-commerce & Admin Support',
    description:
      'Reliable support for website updates, e-commerce product listings, Amazon catalog work, data entry, and online admin tasks.',
    url: 'https://leonislam.com',
    siteName: 'Leon Islam Portfolio',
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Leon Islam - Website, E-commerce & Admin Support' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Leon Islam - Website, E-commerce & Admin Support',
    description: 'Website, e-commerce, Amazon, data entry, and admin support services.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Person',
                  '@id': 'https://leonislam.com/#person',
                  name: 'Leon Islam',
                  jobTitle: 'Website, E-commerce & Admin Support Specialist',
                  description: 'Website, e-commerce, Amazon, data entry, and online admin support.',
                  email: 'info@leonislam.com',
                  telephone: '+8801521783498',
                  url: 'https://leonislam.com',
                  sameAs: ['https://wa.me/8801521783498'],
                  knowsAbout: ['Website Management', 'Website Data Entry', 'E-commerce Product Listings', 'Amazon Product Listings', 'Virtual Assistance', 'Data Entry'],
                },
                {
                  '@type': 'ProfessionalService',
                  '@id': 'https://leonislam.com/#service',
                  name: 'Leon Islam Online Support Services',
                  url: 'https://leonislam.com',
                  provider: { '@id': 'https://leonislam.com/#person' },
                  areaServed: 'Worldwide',
                  serviceType: ['Website management', 'E-commerce product listing', 'Amazon product listing', 'Website data entry', 'Virtual admin support'],
                },
              ],
            }),
          }}
        />
      </head>
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <PublicSiteOverlays measurementId={GOOGLE_ANALYTICS_ID} />
          <Toaster position="top-center" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
