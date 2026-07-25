import { ImageResponse } from 'next/og'
import { getServicePage, servicePages } from '@/lib/service-pages'

export const alt = 'Leon Islam service overview'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function generateStaticParams() {
  return servicePages.map((service) => ({ slug: service.slug }))
}

export default async function ServiceOpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = getServicePage(slug)
  const title = service?.title ?? 'Online Support Services'
  const description = service?.intro ?? 'Practical support for websites, e-commerce, Amazon, data entry, and online administration.'
  const eyebrow = service?.eyebrow ?? 'Leon Islam services'

  return new ImageResponse(
    (
      <div style={{ background: 'linear-gradient(135deg, #172554 0%, #4338ca 50%, #0f766e 100%)', color: 'white', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', padding: '68px', width: '100%' }}>
        <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ alignItems: 'center', display: 'flex', fontSize: 30, fontWeight: 700 }}>
            <div style={{ alignItems: 'center', background: 'rgba(255,255,255,.16)', borderRadius: 18, display: 'flex', fontSize: 25, height: 48, justifyContent: 'center', marginRight: 16, width: 48 }}>LI</div>
            Leon Islam
          </div>
          <div style={{ border: '1px solid rgba(255,255,255,.28)', borderRadius: 999, display: 'flex', fontSize: 20, padding: '10px 18px' }}>{eyebrow}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 1000 }}>
          <div style={{ display: 'flex', fontSize: 64, fontWeight: 800, letterSpacing: '-2.5px', lineHeight: 1.08 }}>{title}</div>
          <div style={{ display: 'flex', fontSize: 27, lineHeight: 1.35, marginTop: 26, opacity: 0.86 }}>{description}</div>
        </div>
        <div style={{ display: 'flex', fontSize: 23, fontWeight: 600, opacity: 0.8 }}>leonislam.com/services</div>
      </div>
    ),
    size,
  )
}
