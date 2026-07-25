import { ImageResponse } from 'next/og'

export const alt = 'Leon Islam — Website, E-commerce & Admin Support'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ background: 'linear-gradient(135deg, #172554 0%, #4338ca 52%, #0f766e 100%)', color: 'white', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', padding: '72px', width: '100%' }}>
        <div style={{ display: 'flex', fontSize: 30, fontWeight: 600, opacity: 0.85 }}>Leon Islam</div>
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 940 }}>
          <div style={{ display: 'flex', fontSize: 70, fontWeight: 800, letterSpacing: '-3px', lineHeight: 1.05 }}>Website, e-commerce &amp; admin support.</div>
          <div style={{ display: 'flex', fontSize: 30, lineHeight: 1.4, marginTop: 28, opacity: 0.85 }}>Website management · Product listings · Amazon support · Data entry</div>
        </div>
        <div style={{ display: 'flex', fontSize: 24, opacity: 0.75 }}>leonislam.com</div>
      </div>
    ),
    size,
  )
}
