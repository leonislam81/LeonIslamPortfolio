import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Leon Islam | Website, E-commerce & Admin Support',
    short_name: 'Leon Islam',
    description: 'Website, e-commerce, Amazon, data entry, and admin support services.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: '#4338ca',
    icons: [
      { src: '/icon', sizes: '512x512', type: 'image/png' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  }
}
