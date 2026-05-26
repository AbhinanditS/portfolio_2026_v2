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
import { Project, EXPANDED_WIDTHS } from '@/lib/projects'
import { DeviceWrapper } from './DeviceWrapper'

const SPRING = { type: 'spring' as const, stiffness: 200, damping: 26 }

interface Props {
  project: Project
  homeRect: { left: number; top: number; width: number; height: number }
  onClose: () => void
}

export function CaseStudy({ project, homeRect, onClose }: Props) {
  const expandedWidth = EXPANDED_WIDTHS[project.device]

  // Where the expanded device lives (center of right 52% of viewport)
  const expandedCenterX = window.innerWidth * 0.74
  const expandedCenterY = window.innerHeight * 0.5

  // Where it came from (device card center at click time)
  const homeCenterX = homeRect.left + homeRect.width / 2
  const homeCenterY = homeRect.top + homeRect.height / 2

  // FLIP deltas and scale ratio
  const deltaX = homeCenterX - expandedCenterX
  const deltaY = homeCenterY - expandedCenterY
  const homeScale = homeRect.width / expandedWidth

  // How far (in progress units) the user needs to drag — Y-axis governs gesture
  const dismissDist = Math.max(Math.abs(deltaY), window.innerHeight * 0.4)

  // ─── Single progress value drives every visual ───────────────────────────
  // 0 = case study open, 1 = back at home card position
  const progress = useMotionValue(1) // starts at 1, springs to 0 on mount

  const deviceX     = useTransform(progress, [0, 1], [0, deltaX])
  const deviceY     = useTransform(progress, [0, 1], [0, deltaY])
  const deviceScale = useTransform(progress, [0, 1], [1, homeScale])
  const panelOpacity = useTransform(progress, [0, 0.35], [1, 0])
  const bgBlurNum   = useTransform(progress, [0, 1], [16, 0])
  const bgAlpha     = useTransform(progress, [0, 1], [0.55, 0])
  const bgFilter    = useMotionTemplate`blur(${bgBlurNum}px)`
  const bgColor     = useMotionTemplate`rgba(235,235,235,${bgAlpha})`

  // Ref to running animation so we can interrupt it any time
  const anim = useRef<AnimationPlaybackControls | null>(null)
  // Ref to the draggable element for cursor manipulation
  const deviceEl = useRef<HTMLDivElement>(null)

  // ─── Mount: spring from home → expanded ──────────────────────────────────
  useEffect(() => {
    anim.current = animate(progress, 0, { ...SPRING })
    return () => anim.current?.stop()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Escape key ──────────────────────────────────────────────────────────
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      anim.current?.stop()
      anim.current = animate(progress, 1, {
        ...SPRING,
        onComplete: () => onCloseRef.current(),
      })
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [progress])

  // ─── Gesture state ───────────────────────────────────────────────────────
  const isDragging  = useRef(false)
  const startY      = useRef(0)
  const startProg   = useRef(0)
  const velBuf      = useRef<{ p: number; t: number }[]>([])

  // springTo: interrupt current animation, start new spring toward target
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
    const el = e.currentTarget as HTMLElement
    el.setPointerCapture(e.pointerId)
    if (deviceEl.current) deviceEl.current.style.cursor = 'grabbing'

    // Interrupt any running spring — immediately responsive
    anim.current?.stop()
    anim.current = null

    isDragging.current  = true
    startY.current      = e.clientY
    startProg.current   = progress.get()
    velBuf.current      = [{ p: progress.get(), t: performance.now() }]
  }, [progress])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return
    const dy = e.clientY - startY.current
    // Dragging down → toward home (progress 1). Dragging back up → toward expanded (progress 0).
    const raw     = startProg.current + dy / (dismissDist * 0.65)
    const clamped = Math.max(-0.1, Math.min(1.1, raw)) // slight overshoot for spring feel
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

    // px/s equivalent for threshold comparison
    const pxVel = progressVel * dismissDist * 0.65
    springTo(pxVel > 320 || cur > 0.4 ? 1 : 0, progressVel)
  }, [progress, dismissDist, springTo])

  return (
    <>
      {/* Backdrop blur — covers the home page */}
      <motion.div
        className="fixed inset-0 z-40 pointer-events-none"
        style={{ backdropFilter: bgFilter, backgroundColor: bgColor }}
      />

      {/* Left — scrollable case study */}
      <motion.div
        className="fixed left-0 top-0 z-50 h-screen overflow-y-auto pointer-events-none"
        style={{ width: '48%', opacity: panelOpacity, padding: '80px 6vw 80px' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '56px' }}>
          {project.caseStudy.map((s) => (
            <div key={s.label}>
              <span style={{
                display: 'block', fontSize: '11px', letterSpacing: '0.12em',
                textTransform: 'uppercase', opacity: 0.5, marginBottom: '10px',
              }}>
                {s.label}
              </span>
              <h2 style={{ fontSize: '22px', fontWeight: 500, lineHeight: 1.1, marginBottom: '14px' }}>
                {s.heading}
              </h2>
              <p style={{ fontSize: '15px', lineHeight: 1.55, opacity: 0.65, maxWidth: '60ch' }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Right — device, draggable to dismiss */}
      <div
        className="fixed right-0 top-0 z-50"
        style={{ width: '52%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <motion.div
          ref={deviceEl}
          style={{
            x: deviceX, y: deviceY, scale: deviceScale,
            transformOrigin: 'center center',
            cursor: 'grab',
            userSelect: 'none',
            touchAction: 'none',
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
