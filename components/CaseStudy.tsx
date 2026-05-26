'use client'

import { useRef, useCallback, useEffect } from 'react'
import {
  motion,
  useMotionValue,
  useTransform,
  useMotionTemplate,
  animate,
  AnimationPlaybackControls,
} from 'framer-motion'
import { Project, EXPANDED_WIDTHS, MOBILE_EXPANDED_WIDTHS, DEVICE_ASPECT_HW } from '@/lib/projects'
import { DeviceWrapper } from './DeviceWrapper'

const SPRING = { type: 'spring' as const, stiffness: 200, damping: 26 }

interface Props {
  project: Project
  homeRect: { left: number; top: number; width: number; height: number }
  onClose: () => void
}

export function CaseStudy({ project, homeRect, onClose }: Props) {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const isMobile = vw < 640

  const expandedWidth = isMobile ? MOBILE_EXPANDED_WIDTHS[project.device] : EXPANDED_WIDTHS[project.device]
  const deviceH = expandedWidth * DEVICE_ASPECT_HW[project.device]
  const topPad = isMobile ? vh * 0.06 : vh * 0.10

  // Where the expanded device center lives in viewport coords
  const expandedCenterX = isMobile ? vw * 0.5 : vw * 0.74
  const expandedCenterY = topPad + deviceH / 2

  const homeCenterX = homeRect.left + homeRect.width / 2
  const homeCenterY = homeRect.top + homeRect.height / 2

  const deltaX = homeCenterX - expandedCenterX
  const deltaY = homeCenterY - expandedCenterY
  const homeScale = homeRect.width / expandedWidth
  const dismissDist = Math.max(Math.abs(deltaY), vh * 0.4)

  // 0 = case study open, 1 = back at home card
  const progress = useMotionValue(1)

  const deviceX     = useTransform(progress, [0, 1], [0, deltaX])
  const deviceY     = useTransform(progress, [0, 1], [0, deltaY])
  const deviceScale = useTransform(progress, [0, 1], [1, homeScale])
  const panelOpacity = useTransform(progress, [0, 0.35], [1, 0])
  const bgBlurNum   = useTransform(progress, [0, 1], [16, 0])
  const bgAlpha     = useTransform(progress, [0, 1], [0.55, 0])
  const bgFilter    = useMotionTemplate`blur(${bgBlurNum}px)`
  const bgColor     = useMotionTemplate`rgba(235,235,235,${bgAlpha})`

  const anim = useRef<AnimationPlaybackControls | null>(null)
  const deviceEl = useRef<HTMLDivElement>(null)

  useEffect(() => {
    anim.current = animate(progress, 0, { ...SPRING })
    return () => anim.current?.stop()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  const handleClose = useCallback(() => {
    anim.current?.stop()
    anim.current = animate(progress, 1, {
      ...SPRING,
      onComplete: () => onCloseRef.current(),
    })
  }, [progress])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleClose])

  // ── Gesture dismiss ───────────────────────────────────────────────────────
  const isDragging  = useRef(false)
  const startY      = useRef(0)
  const startProg   = useRef(0)
  const velBuf      = useRef<{ p: number; t: number }[]>([])

  const springTo = useCallback((target: number, vel: number) => {
    anim.current?.stop()
    anim.current = animate(progress, target, {
      ...SPRING,
      velocity: vel,
      onComplete: target === 1 ? () => onCloseRef.current() : undefined,
    })
  }, [progress])

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    if (deviceEl.current) deviceEl.current.style.cursor = 'grabbing'
    anim.current?.stop()
    anim.current = null
    isDragging.current = true
    startY.current     = e.clientY
    startProg.current  = progress.get()
    velBuf.current     = [{ p: progress.get(), t: performance.now() }]
  }, [progress])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return
    const dy = e.clientY - startY.current
    const raw = startProg.current + dy / (dismissDist * 0.65)
    const clamped = Math.max(-0.1, Math.min(1.1, raw))
    progress.set(clamped)
    velBuf.current.push({ p: clamped, t: performance.now() })
    if (velBuf.current.length > 6) velBuf.current.shift()
  }, [progress, dismissDist])

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return
    isDragging.current = false
    ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    if (deviceEl.current) deviceEl.current.style.cursor = 'grab'
    const cur = progress.get()
    const samples = velBuf.current.slice(-3)
    let progressVel = 0
    if (samples.length >= 2) {
      const a = samples[0], b = samples[samples.length - 1]
      const dt = (b.t - a.t) / 1000
      progressVel = dt > 0.005 ? (b.p - a.p) / dt : 0
    }
    springTo(progressVel * dismissDist * 0.65 > 320 || cur > 0.4 ? 1 : 0, progressVel)
  }, [progress, dismissDist, springTo])

  // ── Layout ────────────────────────────────────────────────────────────────
  // Device panel: pointer-events none so backdrop click-to-close works on empty areas
  const devicePanelStyle: React.CSSProperties = isMobile ? {
    position: 'fixed', top: 0, left: 0, right: 0,
    height: `${topPad + deviceH + 16}px`,
    display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
    paddingTop: `${topPad}px`,
    zIndex: 50, pointerEvents: 'none',
  } : {
    position: 'fixed', right: 0, top: 0, width: '52%', height: '100vh',
    display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
    paddingTop: `${topPad}px`,
    zIndex: 50, pointerEvents: 'none',
  }

  // Case study panel: scrollable, no click-through to backdrop
  const casePanelStyle: React.CSSProperties = isMobile ? {
    position: 'fixed',
    top: `${topPad + deviceH + 32}px`,
    left: 0, right: 0, bottom: 0,
    overflowY: 'auto',
    zIndex: 51,
    padding: '0 6vw 80px',
  } : {
    position: 'fixed', left: 0, top: 0,
    width: '48%', height: '100vh',
    overflowY: 'auto',
    zIndex: 51,
    padding: '80px 6vw 80px',
  }

  return (
    <>
      {/* Backdrop — click anywhere on grey to close */}
      <motion.div
        className="fixed inset-0 z-40"
        style={{ backdropFilter: bgFilter, backgroundColor: bgColor }}
        onClick={handleClose}
      />

      {/* Close button */}
      <motion.div
        style={{
          position: 'fixed', top: '24px', right: '24px',
          zIndex: 60, opacity: panelOpacity,
        }}
      >
        <button
          onClick={handleClose}
          style={{
            fontSize: '10px', letterSpacing: '0.14em',
            textTransform: 'uppercase', fontWeight: 500,
            opacity: 0.5, padding: '8px 0',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.opacity = '1')}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.opacity = '0.5')}
        >
          Close
        </button>
      </motion.div>

      {/* Case study — scrolls on left (desktop) or below device (mobile) */}
      <motion.div style={{ ...casePanelStyle, opacity: panelOpacity }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '36px' : '52px' }}>
          {project.caseStudy.map((s) => (
            <div key={s.label}>
              <span style={{
                display: 'block',
                fontSize: '10px', letterSpacing: '0.15em',
                textTransform: 'uppercase', opacity: 0.38,
                marginBottom: '9px', fontWeight: 500,
              }}>
                {s.label}
              </span>
              <h2 style={{
                fontSize: isMobile ? '18px' : '21px',
                fontWeight: 600, lineHeight: 1.15,
                letterSpacing: '-0.03em', marginBottom: '12px',
              }}>
                {s.heading}
              </h2>
              <p style={{
                fontSize: isMobile ? '13px' : '14px',
                lineHeight: 1.72, opacity: 0.6,
                maxWidth: '52ch',
              }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Device — anchored at top, draggable to dismiss */}
      <div style={devicePanelStyle}>
        <motion.div
          ref={deviceEl}
          style={{
            x: deviceX, y: deviceY, scale: deviceScale,
            transformOrigin: 'center center',
            cursor: 'grab', userSelect: 'none', touchAction: 'none',
            pointerEvents: 'auto',
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <DeviceWrapper type={project.device} width={expandedWidth} />
        </motion.div>
      </div>
    </>
  )
}
