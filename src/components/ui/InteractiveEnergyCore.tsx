'use client'

import React, { useEffect, useRef, useState } from 'react'

export interface InteractiveEnergyCoreProps {
  completionRate?: number // 0 to 100
  streakDays?: number
  size?: number
  className?: string
  showBadge?: boolean
}

export function InteractiveEnergyCore({
  completionRate = 0,
  streakDays = 0,
  size = 280,
  className = '',
  showBadge = false,
}: InteractiveEnergyCoreProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1

    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    const centerX = size / 2
    const centerY = size / 2

    // Rotation angles
    let angleX = 0
    let angleY = 0
    let angleZ = 0
    let angleEquatorial = 0

    // Particle nodes on orbital rings
    const particleCount = 36
    const ringColors = ['#22d3ee', '#f43f5e', '#fbbf24', '#34d399', '#a855f7']

    const particles = Array.from({ length: particleCount }, (_, idx) => ({
      orbitIndex: idx % 5,
      angle: (idx / particleCount) * Math.PI * 2,
      speed: (0.015 + (idx % 4) * 0.005) * (1 + Math.min(streakDays, 14) * 0.05),
      size: 1.2 + (idx % 3) * 1.2,
      color: ringColors[idx % ringColors.length],
    }))

    // Equatorial orbital dust ring particles
    const dustCount = 40
    const dustParticles = Array.from({ length: dustCount }, () => ({
      dist: size * (0.34 + Math.random() * 0.16),
      angle: Math.random() * Math.PI * 2,
      speed: 0.006 + Math.random() * 0.008,
      size: 0.8 + Math.random() * 1.4,
      opacity: 0.3 + Math.random() * 0.6,
      color: ringColors[Math.floor(Math.random() * ringColors.length)],
    }))

    // Mouse tilt damping
    let targetTiltX = 0
    let targetTiltY = 0
    let currentTiltX = 0
    let currentTiltY = 0

    let tick = 0

    const render = () => {
      tick++
      ctx.clearRect(0, 0, size, size)

      // Smooth tilt towards mouse position
      currentTiltX += (targetTiltX - currentTiltX) * 0.08
      currentTiltY += (targetTiltY - currentTiltY) * 0.08

      const speedMultiplier = 1 + (completionRate / 100) * 0.75 + Math.min(streakDays, 10) * 0.05
      angleX += 0.012 * speedMultiplier
      angleY += 0.016 * speedMultiplier
      angleZ += 0.009 * speedMultiplier
      angleEquatorial += 0.005 * speedMultiplier

      const pulse = Math.sin(tick * 0.06) * (size * 0.02)
      const coreRadius = Math.max(18, size * 0.1 + (completionRate / 100) * (size * 0.035) + pulse)

      // 1. Radiant Atmospheric Nebula Glow
      const glowGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        coreRadius * 0.4,
        centerX,
        centerY,
        size * 0.48
      )
      glowGrad.addColorStop(0, 'rgba(34, 211, 238, 0.45)')
      glowGrad.addColorStop(0.25, 'rgba(168, 85, 247, 0.25)')
      glowGrad.addColorStop(0.55, 'rgba(244, 63, 94, 0.12)')
      glowGrad.addColorStop(1, 'rgba(0,0,0,0)')

      ctx.fillStyle = glowGrad
      ctx.beginPath()
      ctx.arc(centerX, centerY, size * 0.48, 0, Math.PI * 2)
      ctx.fill()

      // 2. Draw Wide Equatorial Galaxy Ring with HUD Ticks
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.scale(1, 0.28 + currentTiltY * 0.15)
      ctx.rotate(currentTiltX * 0.2)

      // Equatorial Outer Track
      ctx.beginPath()
      ctx.arc(0, 0, size * 0.44, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.35)'
      ctx.lineWidth = 1.2
      ctx.shadowColor = '#22d3ee'
      ctx.shadowBlur = 8
      ctx.stroke()

      // Equatorial Inner Track
      ctx.beginPath()
      ctx.arc(0, 0, size * 0.38, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)'
      ctx.lineWidth = 0.8
      ctx.stroke()

      // Rotating HUD tick dashes
      const tickCount = 28
      for (let i = 0; i < tickCount; i++) {
        const tAngle = (i / tickCount) * Math.PI * 2 + angleEquatorial
        const innerR = size * 0.41
        const outerR = size * (i % 4 === 0 ? 0.45 : 0.43)
        const x1 = Math.cos(tAngle) * innerR
        const y1 = Math.sin(tAngle) * innerR
        const x2 = Math.cos(tAngle) * outerR
        const y2 = Math.sin(tAngle) * outerR

        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.strokeStyle = i % 2 === 0 ? 'rgba(34, 211, 238, 0.6)' : 'rgba(244, 63, 94, 0.5)'
        ctx.lineWidth = 1.2
        ctx.stroke()
      }
      ctx.restore()

      // 3. Draw Orbiting Dust Particles in Equatorial Plane
      dustParticles.forEach((d) => {
        d.angle += d.speed * speedMultiplier
        const dx = Math.cos(d.angle) * d.dist
        const dy = Math.sin(d.angle) * d.dist * (0.28 + currentTiltY * 0.15)

        ctx.beginPath()
        ctx.arc(centerX + dx, centerY + dy, d.size, 0, Math.PI * 2)
        ctx.fillStyle = d.color
        ctx.globalAlpha = d.opacity
        ctx.shadowColor = d.color
        ctx.shadowBlur = 6
        ctx.fill()
      })
      ctx.globalAlpha = 1

      // 4. The 4 Intersecting 3D Neon Rings (Exact match to reference image)
      const ringConfigs = [
        // Ring 1: Electric Cyan (Tilted Right)
        {
          radiusX: size * 0.39,
          radiusY: size * 0.16,
          tilt: 0.72 + currentTiltY * 0.35,
          rot: angleX + 0.4,
          color: '#22d3ee',
          width: 2,
        },
        // Ring 2: Vibrant Magenta / Hot Pink (Tilted Left)
        {
          radiusX: size * 0.37,
          radiusY: size * 0.15,
          tilt: -0.78 + currentTiltX * 0.35,
          rot: angleY - 0.5,
          color: '#f43f5e',
          width: 2,
        },
        // Ring 3: Solar Gold / Amber (Steep Angle)
        {
          radiusX: size * 0.35,
          radiusY: size * 0.17,
          tilt: 1.2 + currentTiltY * 0.25,
          rot: -angleZ + 0.8,
          color: '#fbbf24',
          width: 1.8,
        },
        // Ring 4: Radiant Emerald Green
        {
          radiusX: size * 0.32,
          radiusY: size * 0.14,
          tilt: -0.55 + currentTiltX * 0.3,
          rot: angleX * 1.4 - 0.9,
          color: '#34d399',
          width: 1.8,
        },
      ]

      ringConfigs.forEach((ring) => {
        ctx.save()
        ctx.translate(centerX, centerY)
        ctx.rotate(ring.rot)
        ctx.scale(1, ring.tilt)

        ctx.beginPath()
        ctx.arc(0, 0, ring.radiusX, 0, Math.PI * 2)
        ctx.strokeStyle = ring.color
        ctx.lineWidth = ring.width
        ctx.shadowColor = ring.color
        ctx.shadowBlur = isHovered ? 18 : 12
        ctx.stroke()
        ctx.restore()
      })

      // 5. Draw Orbiting Energy Photons along the 4 rings
      particles.forEach((p) => {
        p.angle += p.speed
        const ring = ringConfigs[p.orbitIndex % ringConfigs.length]

        const px = Math.cos(p.angle) * ring.radiusX
        const py = Math.sin(p.angle) * ring.radiusX * ring.tilt

        const rotatedX = px * Math.cos(ring.rot) - py * Math.sin(ring.rot)
        const rotatedY = px * Math.sin(ring.rot) + py * Math.cos(ring.rot)

        ctx.beginPath()
        ctx.arc(centerX + rotatedX, centerY + rotatedY, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.shadowColor = p.color
        ctx.shadowBlur = 10
        ctx.fill()
      })

      // 6. Central Solid Hyper-Intense Plasma Core Sphere
      const sphereGrad = ctx.createRadialGradient(
        centerX - coreRadius * 0.3,
        centerY - coreRadius * 0.3,
        coreRadius * 0.08,
        centerX,
        centerY,
        coreRadius
      )
      sphereGrad.addColorStop(0, '#ffffff')
      sphereGrad.addColorStop(0.25, '#cffafe') // Bright light cyan
      sphereGrad.addColorStop(0.65, '#22d3ee') // Cyan plasma
      sphereGrad.addColorStop(1, '#0891b2')

      ctx.save()
      ctx.beginPath()
      ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2)
      ctx.fillStyle = sphereGrad
      ctx.shadowColor = '#22d3ee'
      ctx.shadowBlur = isHovered ? 35 : 25
      ctx.fill()
      ctx.restore()

      // 7. Internal Cross-Section Laser Ribbons
      ctx.save()
      ctx.beginPath()
      ctx.ellipse(centerX, centerY, coreRadius * 1.3, coreRadius * 0.4, angleZ * 2, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)'
      ctx.lineWidth = 1.5
      ctx.shadowColor = '#ffffff'
      ctx.shadowBlur = 8
      ctx.stroke()
      ctx.restore()

      ctx.save()
      ctx.beginPath()
      ctx.ellipse(centerX, centerY, coreRadius * 1.2, coreRadius * 0.35, -angleX * 2, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.75)'
      ctx.lineWidth = 1.2
      ctx.shadowColor = '#f43f5e'
      ctx.shadowBlur = 6
      ctx.stroke()
      ctx.restore()

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [completionRate, streakDays, size, isHovered])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const xPct = (e.clientX - rect.left) / rect.width - 0.5
    const yPct = (e.clientY - rect.top) / rect.height - 0.5
    setMouseOffset({ x: xPct, y: yPct })
  }

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setMouseOffset({ x: 0, y: 0 })
      }}
    >
      {/* 3D Canvas Energy Core */}
      <div className="relative group cursor-pointer transition-transform duration-300 hover:scale-105">
        <canvas
          ref={canvasRef}
          style={{ width: size, height: size }}
          className="filter drop-shadow-[0_0_35px_rgba(34,211,238,0.4)]"
        />

        {/* Dynamic Center Tooltip Overlay on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="px-3 py-1.5 rounded-full bg-slate-900/95 border border-cyan-500/40 text-xs font-bold text-cyan-300 shadow-2xl backdrop-blur-xl font-cairo">
            {Math.round(completionRate)}% طاقة إنجاز نشطة
          </div>
        </div>
      </div>

      {/* Energy Level & Status Label */}
      {showBadge && (
        <div className="mt-1 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-cyan-500/30 backdrop-blur-xl text-xs font-bold text-gray-200 shadow-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-cairo text-gray-300">نواة الطاقة:</span>
          <span className="font-cairo font-black text-cyan-400">
            {completionRate >= 80 ? 'طاقة قصوى متوهجة' : completionRate >= 40 ? 'نشاط مداري متسارع' : 'قيد الشحن والتجهيز'}
          </span>
        </div>
      )}
    </div>
  )
}
