'use client'

import { useRef } from 'react'
import { Project } from '@/lib/projects'
import { DeviceWrapper } from './DeviceWrapper'

// Card-size widths — the natural sizes in the scroll list
const CARD_WIDTHS: Record<string, number> = {
  iphone: 270,
  macbook: 432,
  imac: 594,
}

interface Props {
  project: Project
  onView: (rect: DOMRect) => void
}

export function ProjectCard({ project, onView }: Props) {
  const deviceRef = useRef<HTMLDivElement>(null)
  const cardWidth = CARD_WIDTHS[project.device]

  const handleView = () => {
    if (deviceRef.current) {
      onView(deviceRef.current.getBoundingClientRect())
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '40px',
      }}
    >
      {/* Device */}
      <div ref={deviceRef}>
        <DeviceWrapper type={project.device} width={cardWidth} />
      </div>

      {/* Project info */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          maxWidth: '26ch',
        }}
      >
        <span
          style={{
            fontSize: '15px',
            fontWeight: 500,
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
          }}
        >
          {project.name}
        </span>
        <span
          style={{
            fontSize: '11px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            opacity: 0.45,
            lineHeight: 1.55,
          }}
        >
          {project.year}
        </span>
        <p
          style={{
            fontSize: '13px',
            fontWeight: 400,
            lineHeight: 1.55,
            opacity: 0.55,
            marginTop: '2px',
          }}
        >
          {project.desc}
        </p>
        <button
          onClick={handleView}
          style={{
            marginTop: '10px',
            fontSize: '11px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontWeight: 400,
            opacity: 0.7,
            alignSelf: 'flex-start',
            padding: 0,
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.opacity = '1')}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.opacity = '0.7')}
        >
          View →
        </button>
      </div>
    </div>
  )
}
