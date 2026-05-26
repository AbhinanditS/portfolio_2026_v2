'use client'

import { useRef, useCallback } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { Project } from '@/lib/projects'
import { DeviceWrapper } from './DeviceWrapper'

const CARD_WIDTHS: Record<string, number> = {
  iphone:  200,
  macbook: 360,
  imac:    460,
}

// Bouncy snap-back spring for the downward drag release
const SNAP = { type: 'spring' as const, stiffness: 320, damping: 20, mass: 1.0 }

interface Props {
  project: Project
  onView: (rect: DOMRect) => void
  onOpenWithDrag: (rect: DOMRect, pointerY: number) => void
  isExpanded?: boolean
}

export function ProjectCard({ project, onView, onOpenWithDrag, isExpanded }: Props) {
  const deviceRef = useRef<HTMLDivElement>(null)
  const dragActive  = useRef(false)
  const startY      = useRef(0)
  const didOpenUp   = useRef(false)   // guard against click firing after drag

  // Downward drag: 0 = normal, 1 = max pull-down
  const downDrag   = useMotionValue(0)
  const scaleDown  = useTransform(downDrag, [0, 1], [1, 0.62])

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (isExpanded) return
    e.preventDefault()
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    dragActive.current  = true
    didOpenUp.current   = false
    startY.current      = e.clientY
  }, [isExpanded])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragActive.current || didOpenUp.current) return
    const dy = e.clientY - startY.current

    if (dy < -8) {
      // ── Upward drag past threshold: hand off to case study ──
      didOpenUp.current = true
      dragActive.current = false
      ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
      downDrag.set(0)
      if (deviceRef.current) {
        onOpenWithDrag(deviceRef.current.getBoundingClientRect(), e.clientY)
      }
      return
    }

    if (dy > 0) {
      // ── Downward drag: rubber-band scale-down ──
      // Resistance increases as you pull further
      const pull = dy / 300
      downDrag.set(Math.min(pull / (1 + pull * 0.4), 1))
    } else {
      downDrag.set(0)
    }
  }, [downDrag, onOpenWithDrag])

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!dragActive.current) return
    dragActive.current = false
    ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    // Spring back with a little bounce
    animate(downDrag, 0, SNAP)
  }, [downDrag])

  return (
    <div className="card-layout">
      <motion.div
        ref={deviceRef}
        style={{
          visibility: isExpanded ? 'hidden' : 'visible',
          flexShrink: 0,
          scale: scaleDown,
          transformOrigin: 'center bottom',
          cursor: 'grab',
          touchAction: 'none',
          userSelect: 'none',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <DeviceWrapper type={project.device} width={CARD_WIDTHS[project.device]} />
      </motion.div>

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
          onClick={() => {
            if (didOpenUp.current) return
            if (deviceRef.current) onView(deviceRef.current.getBoundingClientRect())
          }}
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
