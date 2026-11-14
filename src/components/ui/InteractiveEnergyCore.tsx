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
  size = 220,
  className = '',
  showBadge = true,
}: InteractiveEnergyCoreProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  // Color theme determined by completionRate
  const getCoreColors = (rate: number) => {
    if (rate >= 80) {
      return {
        coreGradStart: '#34d399',
        coreGradEnd: '#10b981',
        ringColor: 'rgba(52, 211, 153, 0.7)',
        glowColor: 'rgba(16, 185, 129, 0.45)',
        particleColor: '#fbbf24',
        name: 'طاقة قصوى (100%)',
      }
    }
    if (rate >= 40) {
      return {
        coreGradStart: '#22d3ee',
        coreGradEnd: '#06b6d4',
        ringColor: 'rgba(34, 211, 238, 0.7)',
        glowColor: 'rgba(6, 182, 212, 0.45)',
        particleColor: '#38bdf8',
        name: 'نشط ومتسارع',
      }
    }
    return {
      coreGradStart: '#c084fc',
      coreGradEnd: '#818cf8',
      ringColor: 'rgba(129, 140, 248, 0.7)',
      glowColor: 'rgba(99, 102, 241, 0.4)',
      particleColor: '#e0e7ff',
      name: 'قيد الشحن والتجهيز',
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
    const particleCount = 18
    const particles = Array.from({ length: particleCount }, (_, idx) => ({
      orbitIndex: idx % 3,
      angle: (idx / particleCount) * Math.PI * 2,
      speed: (0.015 + (idx % 3) * 0.008) * (1 + Math.min(streakDays, 14) * 0.05),
      size: 1.5 + (idx % 2) * 1.5,
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

      const speedMultiplier = 1 + (completionRate / 100) * 0.8 + Math.min(streakDays, 10) * 0.04
      angleX += 0.012 * speedMultiplier
      angleY += 0.016 * speedMultiplier
      angleZ += 0.008 * speedMultiplier

      const pulse = Math.sin(tick * 0.05) * 4
      const coreRadius = Math.max(16, 22 + (completionRate / 100) * 10 + pulse)

      // 1. Ambient Outer Core Glow
      const glowGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        coreRadius * 0.5,
        centerX,
        centerY,
        coreRadius * 3.5
      )
      glowGrad.addColorStop(0, colors.glowColor)
      glowGrad.addColorStop(0.5, colors.glowColor.replace('0.4', '0.15').replace('0.45', '0.15'))
      glowGrad.addColorStop(1, 'rgba(0,0,0,0)')

      ctx.fillStyle = glowGrad
      ctx.beginPath()
      ctx.arc(centerX, centerY, coreRadius * 3.5, 0, Math.PI * 2)
      ctx.fill()

      // 2. Draw 3D Projected Orbital Rings
      const ringConfigs = [
        { radiusX: size * 0.38, radiusY: size * 0.14, tilt: 0.6 + currentTiltY * 0.4, rot: angleX },
        { radiusX: size * 0.36, radiusY: size * 0.13, tilt: -0.7 + currentTiltX * 0.4, rot: angleY },
        { radiusX: size * 0.32, radiusY: size * 0.16, tilt: 1.2 + currentTiltY * 0.3, rot: -angleZ },
      ]

      ringConfigs.forEach((ring, rIdx) => {
        ctx.save()
        ctx.translate(centerX, centerY)
        ctx.rotate(ring.rot)
        ctx.scale(1, ring.tilt)

        ctx.beginPath()
        ctx.arc(0, 0, ring.radiusX, 0, Math.PI * 2)
        ctx.strokeStyle = colors.ringColor
        ctx.lineWidth = rIdx === 0 ? 1.5 : 1
        ctx.shadowColor = colors.ringColor
        ctx.shadowBlur = isHovered ? 12 : 6
        ctx.stroke()
        ctx.restore()
      })

      // 3. Draw Orbiting Photons / Energy Nodes
      particles.forEach((p) => {
        p.angle += p.speed
        const ring = ringConfigs[p.orbitIndex]

        const px = Math.cos(p.angle) * ring.radiusX
        const py = Math.sin(p.angle) * ring.radiusX * ring.tilt

        // Rotate coordinates by ring rotation
        const rotatedX = px * Math.cos(ring.rot) - py * Math.sin(ring.rot)
        const rotatedY = px * Math.sin(ring.rot) + py * Math.cos(ring.rot)

        ctx.beginPath()
        ctx.arc(centerX + rotatedX, centerY + rotatedY, p.size, 0, Math.PI * 2)
        ctx.fillStyle = colors.particleColor
        ctx.shadowColor = colors.particleColor
        ctx.shadowBlur = 8
        ctx.fill()
      })

      // 4. Central Solid Energy Core Sphere
      const sphereGrad = ctx.createRadialGradient(
        centerX - coreRadius * 0.3,
        centerY - coreRadius * 0.3,
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
      ctx.shadowBlur = isHovered ? 25 : 16
      ctx.fill()
      ctx.restore()

      // 5. Plasma Core Rings (Cross section)
      ctx.save()
      ctx.beginPath()
      ctx.ellipse(centerX, centerY, coreRadius * 1.15, coreRadius * 0.35, angleZ * 2, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'
      ctx.lineWidth = 1.2
      ctx.stroke()
      ctx.restore()

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [completionRate, streakDays, size, colors, isHovered])

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
      {/* 3D Canvas Energy Sphere */}
      <div className="relative group cursor-pointer transition-transform duration-300 hover:scale-105">
        <canvas
          ref={canvasRef}
          style={{ width: size, height: size }}
          className="filter drop-shadow-[0_0_20px_rgba(99,102,241,0.3)]"
        />

        {/* Dynamic Center Tooltip Overlay on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="px-2.5 py-1 rounded-full bg-slate-900/90 border border-white/20 text-[10px] font-bold text-white shadow-xl backdrop-blur-md">
            {Math.round(completionRate)}% طاقة إنجاز
          </div>
        </div>
      </div>

      {/* Energy Level & Status Label */}
      {showBadge && (
        <div className="mt-1 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 backdrop-blur-md text-[11px] font-bold text-gray-200">
          <span
            className="w-2 h-2 rounded-full animate-ping"
            style={{ backgroundColor: colors.coreGradStart }}
          />
          <span className="font-cairo">نواة الطاقة: {colors.name}</span>
        </div>
      )}
    </div>
  )
}
