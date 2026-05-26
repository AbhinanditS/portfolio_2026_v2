'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion'
import { projects, Project } from '@/lib/projects'
import { ProjectCard } from '@/components/ProjectCard'
import { CaseStudy } from '@/components/CaseStudy'

interface ExpandedState {
  project: Project
  homeRect: DOMRect
}

export default function Page() {
  const [expanded, setExpanded] = useState<ExpandedState | null>(null)

  // Scroll-driven bio blur
  const { scrollY } = useScroll()
  const bioBlur = useTransform(scrollY, [0, 280], [0, 10])
  const bioOpacity = useTransform(scrollY, [0, 350], [1, 0.2])
  const bioFilter = useMotionTemplate`blur(${bioBlur}px)`

  const handleView = useCallback((project: Project, homeRect: DOMRect) => {
    setExpanded({ project, homeRect })
    document.body.classList.add('locked')
  }, [])

  const handleClose = useCallback(() => {
    setExpanded(null)
    document.body.classList.remove('locked')
  }, [])

  useEffect(() => {
    return () => document.body.classList.remove('locked')
  }, [])

  return (
    <main style={{ position: 'relative', background: '#EBEBEB' }}>
      {/* ── Bio — fixed, centered, blurs on scroll ── */}
      <motion.div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          x: '-50%',
          y: '-50%',
          zIndex: 1,
          pointerEvents: 'none',
          filter: bioFilter,
          opacity: bioOpacity,
        }}
      >
        <p
          style={{
            fontWeight: 400,
            fontSize: '17px',
            lineHeight: 1.6,
            maxWidth: '38ch',
            color: '#111',
            textAlign: 'left',
          }}
        >
          Hey!
          <br />
          I&apos;m an interaction designer at Bosch, designing for complex B2B
          use cases. Previously I was at a design agency, a start-up and a US
          based MNC. I love to read, and play football, and glaze over my own
          music taste.
        </p>
      </motion.div>

      {/* ── Scrollable project layer — sits above bio in z-order ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          paddingTop: '95vh',
          paddingBottom: '40vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '140px',
          paddingLeft: '6vw',
          paddingRight: '6vw',
        }}
      >
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onView={(rect) => handleView(project, rect)}
          />
        ))}
      </div>

      {/* ── Case study overlay ── */}
      {expanded && (
        <CaseStudy
          project={expanded.project}
          homeRect={expanded.homeRect}
          onClose={handleClose}
        />
      )}
    </main>
  )
}
