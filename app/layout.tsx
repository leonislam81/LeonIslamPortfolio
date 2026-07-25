import type React from 'react';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://leonislam.dev'),
  title: 'Leon Islam - Website, E-commerce & Admin Support',
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
  openGraph: {
    title: 'Leon Islam - Website, E-commerce & Admin Support',
    description:
      'Reliable support for website updates, e-commerce product listings, Amazon catalog work, data entry, and online admin tasks.',
    url: 'https://leonislam.dev',
    siteName: 'Leon Islam Portfolio',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Leon Islam - Website Development Specialist',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Leon Islam - Website, E-commerce & Admin Support',
    description: 'Website, e-commerce, Amazon, data entry, and admin support services.',
    images: ['/og-image.jpg'],
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
  generator: 'v0.app',
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
              '@type': 'Person',
              name: 'Leon Islam',
              jobTitle: 'Website, E-commerce & Admin Support Specialist',
              description:
                'WordPress, Shopify & Wix specialist offering professional website development and management services',
              email: 'leonislam810@gmail.com',
              telephone: '+8801521783498',
              url: 'https://leonislam.dev',
              sameAs: ['https://wa.me/8801521783498'],
              knowsAbout: [
                'Website Management', 'Website Data Entry', 'E-commerce Product Listings', 'Amazon Product Listings', 'Virtual Assistance', 'Data Entry',
              ],
              '@graph': [
                {
                  '@type': 'Service',
                  name: 'WordPress Development & Management',
                  description:
                    'Fast, secure WordPress sites with clean themes, SEO basics, and reliable updates',
                },
                {
                  '@type': 'Service',
                  name: 'Shopify Setup & Customization',
                  description:
                    'Conversion-ready stores, theme tweaks, product setup, app integrations',
                },
                {
                  '@type': 'Service',
                  name: 'Wix Design & Launch',
                  description: 'Modern, responsive designs delivered quickly',
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-center" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
