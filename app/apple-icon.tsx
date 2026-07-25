import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ alignItems: 'center', background: 'linear-gradient(135deg, #4338ca 0%, #0f766e 100%)', color: 'white', display: 'flex', fontFamily: 'Arial, sans-serif', fontSize: 82, fontWeight: 800, height: '100%', justifyContent: 'center', letterSpacing: '-7px', width: '100%' }}>
        LI
      </div>
    ),
    size,
  )
}
