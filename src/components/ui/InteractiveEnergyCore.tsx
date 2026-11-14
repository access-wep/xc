'use client'

import React, { useEffect, useRef, useState } from 'react'

export interface InteractiveEnergyCoreProps {
  completionRate?: number // 0 to 100
  streakDays?: number
  size?: number
  className?: string
  showBadge?: boolean
  showAura?: boolean
}

export function InteractiveEnergyCore({
  completionRate = 0,
  streakDays = 0,
  size = 260,
  className = '',
  showBadge = true,
  showAura = true,
}: InteractiveEnergyCoreProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  // Color theme determined by completionRate
  const getCoreColors = (rate: number) => {
    if (rate >= 80) {
      return {
        coreGradStart: '#6ee7b7',
        coreGradEnd: '#10b981',
        ringColor: 'rgba(52, 211, 153, 0.75)',
        ringSecondary: 'rgba(16, 185, 129, 0.4)',
        glowColor: 'rgba(16, 185, 129, 0.45)',
        particleColor: '#fbbf24',
        name: 'طاقة قصوى متوهجة (Full Overdrive)',
        accentColor: '#34d399',
      }
    }
    if (rate >= 40) {
      return {
        coreGradStart: '#67e8f9',
        coreGradEnd: '#06b6d4',
        ringColor: 'rgba(34, 211, 238, 0.75)',
        ringSecondary: 'rgba(6, 182, 212, 0.4)',
        glowColor: 'rgba(6, 182, 212, 0.45)',
        particleColor: '#38bdf8',
        name: 'نشاط مداري متسارع (Accelerating)',
        accentColor: '#22d3ee',
      }
    }
    return {
      coreGradStart: '#d8b4fe',
      coreGradEnd: '#818cf8',
      ringColor: 'rgba(129, 140, 248, 0.75)',
      ringSecondary: 'rgba(99, 102, 241, 0.4)',
      glowColor: 'rgba(99, 102, 241, 0.4)',
      particleColor: '#e0e7ff',
      name: 'قيد الشحن والتجهيز (Charging)',
      accentColor: '#a855f7',
    }
  }

  const colors = getCoreColors(completionRate)

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

    // Particle nodes on orbital rings
    const particleCount = 24
    const particles = Array.from({ length: particleCount }, (_, idx) => ({
      orbitIndex: idx % 4,
      angle: (idx / particleCount) * Math.PI * 2,
      speed: (0.014 + (idx % 4) * 0.006) * (1 + Math.min(streakDays, 14) * 0.05),
      size: 1.5 + (idx % 3) * 1.2,
      pulseOffset: Math.random() * Math.PI,
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

      const speedMultiplier = 1 + (completionRate / 100) * 0.9 + Math.min(streakDays, 10) * 0.04
      angleX += 0.011 * speedMultiplier
      angleY += 0.015 * speedMultiplier
      angleZ += 0.007 * speedMultiplier

      const pulse = Math.sin(tick * 0.05) * (size * 0.02)
      const coreRadius = Math.max(20, size * 0.12 + (completionRate / 100) * (size * 0.04) + pulse)

      // 1. Ambient Outer Core Glow
      if (showAura) {
        const glowGrad = ctx.createRadialGradient(
          centerX,
          centerY,
          coreRadius * 0.5,
          centerX,
          centerY,
          coreRadius * 3.8
        )
        glowGrad.addColorStop(0, colors.glowColor)
        glowGrad.addColorStop(0.5, colors.glowColor.replace('0.4', '0.12').replace('0.45', '0.12'))
        glowGrad.addColorStop(1, 'rgba(0,0,0,0)')

        ctx.fillStyle = glowGrad
        ctx.beginPath()
        ctx.arc(centerX, centerY, coreRadius * 3.8, 0, Math.PI * 2)
        ctx.fill()
      }

      // 2. Draw 4 3D Projected Orbital Rings with Physical Depth
      const ringConfigs = [
        { radiusX: size * 0.42, radiusY: size * 0.16, tilt: 0.65 + currentTiltY * 0.35, rot: angleX },
        { radiusX: size * 0.38, radiusY: size * 0.14, tilt: -0.72 + currentTiltX * 0.35, rot: angleY },
        { radiusX: size * 0.34, radiusY: size * 0.18, tilt: 1.15 + currentTiltY * 0.25, rot: -angleZ },
        { radiusX: size * 0.29, radiusY: size * 0.12, tilt: -0.4 + currentTiltX * 0.3, rot: angleX * 1.5 },
      ]

      ringConfigs.forEach((ring, rIdx) => {
        ctx.save()
        ctx.translate(centerX, centerY)
        ctx.rotate(ring.rot)
        ctx.scale(1, ring.tilt)

        ctx.beginPath()
        ctx.arc(0, 0, ring.radiusX, 0, Math.PI * 2)
        ctx.strokeStyle = rIdx % 2 === 0 ? colors.ringColor : colors.ringSecondary
        ctx.lineWidth = rIdx === 0 ? 1.8 : 1.2
        ctx.shadowColor = colors.ringColor
        ctx.shadowBlur = isHovered ? 14 : 7
        ctx.stroke()
        ctx.restore()
      })

      // 3. Draw Orbiting Photons & Energy Nodes
      particles.forEach((p) => {
        p.angle += p.speed
        const ring = ringConfigs[p.orbitIndex]

        const px = Math.cos(p.angle) * ring.radiusX
        const py = Math.sin(p.angle) * ring.radiusX * ring.tilt

        // Rotate coordinates by ring rotation
        const rotatedX = px * Math.cos(ring.rot) - py * Math.sin(ring.rot)
        const rotatedY = px * Math.sin(ring.rot) + py * Math.cos(ring.rot)

        const pPulse = Math.sin(tick * 0.1 + p.pulseOffset) * 0.5
        const currentPSize = Math.max(1, p.size + pPulse)

        ctx.beginPath()
        ctx.arc(centerX + rotatedX, centerY + rotatedY, currentPSize, 0, Math.PI * 2)
        ctx.fillStyle = colors.particleColor
        ctx.shadowColor = colors.particleColor
        ctx.shadowBlur = 10
        ctx.fill()
      })

      // 4. Central Solid Energy Core Sphere (with 3D Shading)
      const sphereGrad = ctx.createRadialGradient(
        centerX - coreRadius * 0.35,
        centerY - coreRadius * 0.35,
        coreRadius * 0.1,
        centerX,
        centerY,
        coreRadius
      )
      sphereGrad.addColorStop(0, '#ffffff')
      sphereGrad.addColorStop(0.3, colors.coreGradStart)
      sphereGrad.addColorStop(1, colors.coreGradEnd)

      ctx.save()
      ctx.beginPath()
      ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2)
      ctx.fillStyle = sphereGrad
      ctx.shadowColor = colors.coreGradStart
      ctx.shadowBlur = isHovered ? 30 : 20
      ctx.fill()
      ctx.restore()

      // 5. Plasma Core Rings (Cross section orbital ribbons)
      ctx.save()
      ctx.beginPath()
      ctx.ellipse(centerX, centerY, coreRadius * 1.25, coreRadius * 0.38, angleZ * 2.5, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)'
      ctx.lineWidth = 1.4
      ctx.shadowColor = '#ffffff'
      ctx.shadowBlur = 6
      ctx.stroke()
      ctx.restore()

      // 6. Secondary counter-rotating ribbon
      ctx.save()
      ctx.beginPath()
      ctx.ellipse(centerX, centerY, coreRadius * 1.15, coreRadius * 0.32, -angleX * 2, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.restore()

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [completionRate, streakDays, size, colors, isHovered, showAura])

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
      {/* 3D Canvas Energy Sphere with Holographic Ambient Radiance */}
      <div className="relative group cursor-pointer transition-transform duration-300 hover:scale-105">
        <canvas
          ref={canvasRef}
          style={{ width: size, height: size }}
          className="filter drop-shadow-[0_0_30px_rgba(99,102,241,0.35)]"
        />

        {/* Dynamic Center Tooltip Overlay on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="px-3 py-1.5 rounded-full bg-slate-900/95 border border-white/20 text-xs font-bold text-white shadow-2xl backdrop-blur-xl font-cairo">
            {Math.round(completionRate)}% طاقة إنجاز نشطة
          </div>
        </div>
      </div>

      {/* Energy Level & Status Label */}
      {showBadge && (
        <div className="mt-2 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/85 border border-white/10 backdrop-blur-xl text-xs font-bold text-gray-200 shadow-md">
          <span
            className="w-2.5 h-2.5 rounded-full animate-ping"
            style={{ backgroundColor: colors.accentColor }}
          />
          <span className="font-cairo text-gray-300">نواة الطاقة:</span>
          <span className="font-cairo font-black text-white" style={{ color: colors.accentColor }}>
            {colors.name}
          </span>
        </div>
      )}
    </div>
  )
}
