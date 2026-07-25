import type { MetadataRoute } from 'next'
import { servicePages } from '@/lib/service-pages'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://leonislam.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://leonislam.com/privacy',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: 'https://leonislam.com/services',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://leonislam.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...servicePages.map((service) => ({
      url: `https://leonislam.com/services/${service.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
