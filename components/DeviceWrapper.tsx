'use client'

import { DeviceType } from '@/lib/projects'

interface Props {
  type: DeviceType
  width: number
}

const SRC: Record<DeviceType, string> = {
  iphone:  '/assets/iphone.png',
  macbook: '/assets/macbook.png',
  imac:    '/assets/imac.jpg',
}

export function DeviceWrapper({ type, width }: Props) {
  return (
    <div style={{ width, maxWidth: '100%', position: 'relative', display: 'inline-block', flexShrink: 0 }}>
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
          mixBlendMode: 'multiply',
        }}
      />
    </div>
  )
}
