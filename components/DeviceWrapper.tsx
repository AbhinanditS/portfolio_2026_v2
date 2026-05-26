'use client'

import { DeviceType } from '@/lib/projects'

interface Props {
  type: DeviceType
  width: number
}

const SCREEN: Record<DeviceType, {
  top: string; left: string; right: string; bottom: string; radius: string
}> = {
  iphone:  { top: '2%',  left: '4%',  right: '4%',  bottom: '2%',  radius: '9%' },
  macbook: { top: '4%',  left: '4%',  right: '4%',  bottom: '27%', radius: '2px' },
  imac:    { top: '6%',  left: '10%', right: '10%', bottom: '38%', radius: '3px' },
}

const SRC: Record<DeviceType, string> = {
  iphone:  '/assets/iphone.png',
  macbook: '/assets/macbook.png',
  imac:    '/assets/imac.jpg',
}

export function DeviceWrapper({ type, width }: Props) {
  const screen = SCREEN[type]

  return (
    <div style={{ width, position: 'relative', display: 'inline-block', flexShrink: 0 }}>
      {/* Screen fill — rendered first so it sits behind the device image */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: screen.top,
          left: screen.left,
          right: screen.right,
          bottom: screen.bottom,
          background: '#D0D0D0',
          borderRadius: screen.radius,
          zIndex: 0,
        }}
      />
      {/* Device image — on top of fill; PNG files have transparency in the screen area */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={SRC[type]}
        alt=""
        aria-hidden="true"
        draggable={false}
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          userSelect: 'none',
          pointerEvents: 'none',
          position: 'relative',
          zIndex: 1,
        }}
      />
    </div>
  )
}
