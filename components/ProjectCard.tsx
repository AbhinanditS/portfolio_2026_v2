'use client'

import { useRef } from 'react'
import { Project } from '@/lib/projects'
import { DeviceWrapper } from './DeviceWrapper'

const CARD_WIDTHS: Record<string, number> = {
  iphone:  200,
  macbook: 360,
  imac:    460,
}

interface Props {
  project: Project
  onView: (rect: DOMRect) => void
  isExpanded?: boolean
}

export function ProjectCard({ project, onView, isExpanded }: Props) {
  const deviceRef = useRef<HTMLDivElement>(null)

  const handleView = () => {
    if (deviceRef.current) {
      onView(deviceRef.current.getBoundingClientRect())
    }
  }

  return (
    <div className="card-layout">
      <div ref={deviceRef} style={{ visibility: isExpanded ? 'hidden' : 'visible', flexShrink: 0 }}>
        <DeviceWrapper type={project.device} width={CARD_WIDTHS[project.device]} />
      </div>

      <div className="card-info" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <span style={{
          fontSize: '10px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          opacity: 0.4,
          lineHeight: 1.5,
          fontWeight: 500,
        }}>
          {project.year}
        </span>
        <span style={{
          fontSize: '15px',
          fontWeight: 500,
          lineHeight: 1.1,
          letterSpacing: '-0.025em',
          marginTop: '3px',
        }}>
          {project.name}
        </span>
        <p style={{
          fontSize: '12.5px',
          fontWeight: 400,
          lineHeight: 1.65,
          opacity: 0.52,
          marginTop: '7px',
          maxWidth: '26ch',
        }}>
          {project.desc}
        </p>
        <button
          onClick={handleView}
          style={{
            marginTop: '14px',
            fontSize: '10px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontWeight: 500,
            opacity: 0.55,
            alignSelf: 'flex-start',
            padding: 0,
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.opacity = '1')}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.opacity = '0.55')}
        >
          View →
        </button>
      </div>
    </div>
  )
}
