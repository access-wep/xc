'use client'

import React, { useEffect, useRef, useState } from 'react'

interface Fekrto3DHypercubeProps {
  size?: number
  className?: string
  interactive?: boolean
  showAura?: boolean
}

export function Fekrto3DHypercube({
  size = 420,
  className = '',
  interactive = true,
  showAura = true,
}: Fekrto3DHypercubeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    const cx = size / 2
    const cy = size / 2

    // Cube vertices in 3D (-1 to 1)
    const cubeVertices = [
      [-1, -1, -1],
      [1, -1, -1],
      [1, 1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, 1],
      [-1, 1, 1],
    ]

    // Edges connecting vertices
    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0], // Back
      [4, 5], [5, 6], [6, 7], [7, 4], // Front
      [0, 4], [1, 5], [2, 6], [3, 7], // Connecting sides
    ]

    // Inner diamond core vertices
    const innerVertices = [
      [0, -0.65, 0],
      [0, 0.65, 0],
      [-0.6, 0, 0],
      [0.6, 0, 0],
      [0, 0, -0.6],
      [0, 0, 0.6],
    ]

    const innerEdges = [
      [0, 2], [0, 3], [0, 4], [0, 5],
      [1, 2], [1, 3], [1, 4], [1, 5],
      [2, 4], [4, 3], [3, 5], [5, 2],
    ]

    // Floating Stardust Particles
    const particleCount = 26
    const particles = Array.from({ length: particleCount }, () => ({
      x: (Math.random() - 0.5) * size * 0.9,
      y: (Math.random() - 0.5) * size * 0.9,
      z: (Math.random() - 0.5) * 100,
      size: 1 + Math.random() * 2,
      speedY: 0.2 + Math.random() * 0.4,
      opacity: 0.2 + Math.random() * 0.7,
      color: Math.random() > 0.4 ? '#00f5a0' : '#38bdf8',
    }))

    // Rotation angles
    let rx = 0.45
    let ry = 0.55
    let rz = 0.1
    let tick = 0

    // Mouse tracking for subtle parallax tilt
    let targetTiltX = 0
    let targetTiltY = 0
    let currentTiltX = 0
    let currentTiltY = 0

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return
      const rect = canvas.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      targetTiltX = y * 0.4
      targetTiltY = x * 0.4
    }

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove)
    }

    // 3D rotation projection helper
    const project = (x: number, y: number, z: number, scaleFactor: number) => {
      // Rotate around X
      let y1 = y * Math.cos(rx) - z * Math.sin(rx)
      let z1 = y * Math.sin(rx) + z * Math.cos(rx)

      // Rotate around Y
      let x2 = x * Math.cos(ry) + z1 * Math.sin(ry)
      let z2 = -x * Math.sin(ry) + z1 * Math.cos(ry)

      // Rotate around Z
      let x3 = x2 * Math.cos(rz) - y1 * Math.sin(rz)
      let y3 = x2 * Math.sin(rz) + y1 * Math.cos(rz)

      // Perspective scale
      const fov = 350
      const distance = 3.5
      const projScale = (fov / (z2 + distance)) * (scaleFactor / 300)

      return {
        px: cx + x3 * projScale,
        py: cy + y3 * projScale,
        depth: z2,
      }
    }

    const render = () => {
      tick++
      ctx.clearRect(0, 0, size, size)

      // Damped tilt
      currentTiltX += (targetTiltX - currentTiltX) * 0.05
      currentTiltY += (targetTiltY - currentTiltY) * 0.05

      // Continuous cosmic float and rotation
      const floatY = Math.sin(tick * 0.035) * 8
      rx = 0.35 + currentTiltX + Math.sin(tick * 0.012) * 0.08
      ry += 0.009
      rz = 0.1 + currentTiltY * 0.5

      // 1. Ambient Background Emerald/Cyan Aura
      if (showAura) {
        const auraGrad = ctx.createRadialGradient(cx, cy + floatY, 20, cx, cy + floatY, size * 0.44)
        auraGrad.addColorStop(0, 'rgba(0, 245, 160, 0.35)')
        auraGrad.addColorStop(0.3, 'rgba(16, 185, 129, 0.2)')
        auraGrad.addColorStop(0.6, 'rgba(56, 189, 248, 0.1)')
        auraGrad.addColorStop(1, 'rgba(2, 6, 23, 0)')

        ctx.fillStyle = auraGrad
        ctx.beginPath()
        ctx.arc(cx, cy + floatY, size * 0.44, 0, Math.PI * 2)
        ctx.fill()
      }

      // 2. Orbiting Ellipse Ring (Planetary Ring)
      ctx.save()
      ctx.translate(cx, cy + floatY)
      ctx.rotate(0.35 + Math.sin(tick * 0.01) * 0.05)
      ctx.scale(1, 0.28)

      ctx.beginPath()
      ctx.arc(0, 0, size * 0.42, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(0, 245, 160, 0.45)'
      ctx.lineWidth = 1.5
      ctx.shadowColor = '#00f5a0'
      ctx.shadowBlur = 12
      ctx.stroke()
      ctx.restore()

      // 3. Render Floating Stardust Photons
      particles.forEach((p) => {
        p.y -= p.speedY
        if (p.y < -size * 0.45) p.y = size * 0.45

        ctx.beginPath()
        ctx.arc(cx + p.x, cy + p.y + floatY, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.shadowColor = p.color
        ctx.shadowBlur = 6
        ctx.fill()
      })

      // 4. Project and Draw Inner Glowing Crystal (Emerald Core)
      const scaleBase = size * 0.38
      const innerScale = scaleBase * 0.85

      const projInner = innerVertices.map((v) =>
        project(v[0], v[1], v[2], innerScale)
      )

      // Inner faces glow
      ctx.fillStyle = 'rgba(0, 245, 160, 0.18)'
      ctx.strokeStyle = '#34d399'
      ctx.lineWidth = 1.6
      ctx.shadowColor = '#00f5a0'
      ctx.shadowBlur = 10

      innerEdges.forEach(([i1, i2]) => {
        const p1 = projInner[i1]
        const p2 = projInner[i2]
        ctx.beginPath()
        ctx.moveTo(p1.px, p1.py + floatY)
        ctx.lineTo(p2.px, p2.py + floatY)
        ctx.stroke()
      })

      // 5. Project and Draw Outer Glass Hypercube
      const projOuter = cubeVertices.map((v) =>
        project(v[0], v[1], v[2], scaleBase)
      )

      // Translucent Glass Faces (Back to Front)
      const faces = [
        [0, 1, 2, 3], // Back
        [4, 5, 6, 7], // Front
        [0, 1, 5, 4], // Bottom
        [2, 3, 7, 6], // Top
        [0, 3, 7, 4], // Left
        [1, 2, 6, 5], // Right
      ]

      // Sort faces by depth
      const sortedFaces = faces.map((indices) => {
        const avgDepth =
          indices.reduce((sum, idx) => sum + projOuter[idx].depth, 0) / 4
        return { indices, depth: avgDepth }
      }).sort((a, b) => b.depth - a.depth)

      // Draw Glass Facets with Emerald Shimmer
      sortedFaces.forEach(({ indices }) => {
        ctx.beginPath()
        indices.forEach((idx, i) => {
          const pt = projOuter[idx]
          if (i === 0) ctx.moveTo(pt.px, pt.py + floatY)
          else ctx.lineTo(pt.px, pt.py + floatY)
        })
        ctx.closePath()

        ctx.fillStyle = 'rgba(6, 78, 59, 0.18)'
        ctx.fill()

        ctx.strokeStyle = 'rgba(52, 211, 153, 0.55)'
        ctx.lineWidth = 1.2
        ctx.stroke()
      })

      // Draw Crisp Luminous Outer Edges
      ctx.strokeStyle = '#00f5a0'
      ctx.lineWidth = 2.2
      ctx.shadowColor = '#00f5a0'
      ctx.shadowBlur = 14

      edges.forEach(([i1, i2]) => {
        const p1 = projOuter[i1]
        const p2 = projOuter[i2]
        ctx.beginPath()
        ctx.moveTo(p1.px, p1.py + floatY)
        ctx.lineTo(p2.px, p2.py + floatY)
        ctx.stroke()
      })

      // Draw Vertex Energy Sparkles
      projOuter.forEach((pt) => {
        ctx.beginPath()
        ctx.arc(pt.px, pt.py + floatY, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = '#ffffff'
        ctx.shadowColor = '#00f5a0'
        ctx.shadowBlur = 8
        ctx.fill()
      })

      animId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animId)
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [size, interactive, showAura])

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full max-w-[500px] max-h-[500px] object-contain pointer-events-auto cursor-grab active:cursor-grabbing"
      />
    </div>
  )
}
