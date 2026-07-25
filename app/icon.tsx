import { ImageResponse } from 'next/og'

export const size = { width: 512, height: 512 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ alignItems: 'center', background: 'linear-gradient(135deg, #4338ca 0%, #0f766e 100%)', borderRadius: 108, color: 'white', display: 'flex', fontFamily: 'Arial, sans-serif', fontSize: 230, fontWeight: 800, height: '100%', justifyContent: 'center', letterSpacing: '-18px', width: '100%' }}>
        LI
      </div>
    ),
    size,
  )
}
