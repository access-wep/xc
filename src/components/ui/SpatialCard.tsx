'use client'

import React, { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, type HTMLMotionProps } from 'framer-motion'

export interface SpatialCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode
  className?: string
  neonGlow?: 'cyan' | 'indigo' | 'emerald' | 'amber' | 'purple' | 'none'
  tiltEnabled?: boolean
  popZ?: number
}

export function SpatialCard({
  children,
  className = '',
  neonGlow = 'indigo',
  tiltEnabled = true,
  popZ = 24,
  ...props
}: SpatialCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  // Framer motion spring coordinates
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 260, damping: 25 })
  const mouseYSpring = useSpring(y, { stiffness: 260, damping: 25 })

  // 3D rotation values
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7deg', '-7deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7deg', '7deg'])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()

    const clientX = e.clientX - rect.left
    const clientY = e.clientY - rect.top

    setMousePos({ x: clientX, y: clientY })

    if (tiltEnabled) {
      const width = rect.width
      const height = rect.height

      const xPct = clientX / width - 0.5
      const yPct = clientY / height - 0.5

      x.set(xPct)
      y.set(yPct)
    }
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  // Glow color configurations
  const glowStyles = {
    cyan: {
      spotlight: 'rgba(34, 211, 238, 0.15)',
      underglow: 'rgba(34, 211, 238, 0.25)',
      borderHover: 'rgba(34, 211, 238, 0.4)',
    },
    indigo: {
      spotlight: 'rgba(99, 102, 241, 0.15)',
      underglow: 'rgba(99, 102, 241, 0.25)',
      borderHover: 'rgba(99, 102, 241, 0.4)',
    },
    emerald: {
      spotlight: 'rgba(16, 185, 129, 0.15)',
      underglow: 'rgba(16, 185, 129, 0.25)',
      borderHover: 'rgba(16, 185, 129, 0.4)',
    },
    amber: {
      spotlight: 'rgba(245, 158, 11, 0.15)',
      underglow: 'rgba(245, 158, 11, 0.25)',
      borderHover: 'rgba(245, 158, 11, 0.4)',
    },
    purple: {
      spotlight: 'rgba(192, 132, 252, 0.15)',
      underglow: 'rgba(192, 132, 252, 0.25)',
      borderHover: 'rgba(192, 132, 252, 0.4)',
    },
    none: {
      spotlight: 'rgba(255, 255, 255, 0.08)',
      underglow: 'transparent',
      borderHover: 'rgba(255, 255, 255, 0.2)',
    },
  }[neonGlow]

  return (
    <div
      style={{ perspective: '1200px' }}
      className="relative group/spatial transition-all"
    >
      {/* Neon Underglow Layer */}
      {neonGlow !== 'none' && (
        <div
          className="absolute -inset-1 rounded-3xl blur-xl opacity-0 group-hover/spatial:opacity-60 transition-opacity duration-500 pointer-events-none"
          style={{ background: glowStyles.underglow }}
        />
      )}

      {/* Main 3D Tilted Card Body */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: tiltEnabled ? rotateX : 0,
          rotateY: tiltEnabled ? rotateY : 0,
          transformStyle: 'preserve-3d',
        }}
        className={`relative overflow-hidden rounded-3xl backdrop-blur-2xl bg-slate-900/50 dark:bg-slate-950/70 border border-white/10 dark:border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] transition-all duration-300 ${className}`}
        {...props}
      >
        {/* Spotlight Follower Highlight */}
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, ${glowStyles.spotlight}, transparent 70%)`,
          }}
        />

        {/* Shimmer Border on Hover */}
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl border transition-opacity duration-300"
          style={{
            borderColor: glowStyles.borderHover,
            opacity: isHovered ? 0.7 : 0,
          }}
        />

        {/* Content with 3D Z-Pop */}
        <div
          style={{
            transform: isHovered ? `translateZ(${popZ}px)` : 'translateZ(0px)',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.25s cubic-bezier(0.2, 0, 0, 1)',
          }}
          className="relative z-10 w-full h-full"
        >
          {children}
        </div>
      </motion.div>
    </div>
  )
}
