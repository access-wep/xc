'use client'

import React, { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  color: string
}

export function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    // Palette: Star & photon colors
    const colors = ['#818cf8', '#38bdf8', '#34d399', '#c084fc', '#ffffff']

    // Generate stars
    const starCount = Math.min(Math.floor((width * height) / 12000), 90)
    const stars: Star[] = []

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.8 + 0.6,
        speedX: (Math.random() - 0.5) * 0.15,
        speedY: (Math.random() - 0.5) * 0.15,
        opacity: Math.random() * 0.7 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    // Mouse coordinates for subtle parallax
    let mouseX = width / 2
    let mouseY = height / 2

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    window.addEventListener('mousemove', handleMouseMove)

    let tick = 0

    const render = () => {
      tick++
      ctx.clearRect(0, 0, width, height)

      // Draw each floating cosmic star
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i]

        // Move
        star.x += star.speedX
        star.y += star.speedY

        // Wrap around boundaries
        if (star.x < 0) star.x = width
        if (star.x > width) star.x = 0
        if (star.y < 0) star.y = height
        if (star.y > height) star.y = 0

        // Twinkle
        const twinkle = Math.sin(tick * 0.02 + i) * 0.25
        const currentOpacity = Math.max(0.1, Math.min(1, star.opacity + twinkle))

        // Parallax offset
        const parallaxX = (mouseX - width / 2) * 0.015 * (star.size / 2)
        const parallaxY = (mouseY - height / 2) * 0.015 * (star.size / 2)

        ctx.beginPath()
        ctx.arc(star.x + parallaxX, star.y + parallaxY, star.size, 0, Math.PI * 2)
        ctx.fillStyle = star.color
        ctx.globalAlpha = currentOpacity
        ctx.shadowBlur = star.size > 1.4 ? 8 : 0
        ctx.shadowColor = star.color
        ctx.fill()
      }

      ctx.globalAlpha = 1
      ctx.shadowBlur = 0

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      {/* Deep Space Background Layer */}
      <div className="absolute inset-0 bg-[#020617]" />

      {/* Dynamic Cosmic Nebulae */}
      <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-transparent blur-[120px] pointer-events-none animate-pulse-soft" />
      <div className="absolute top-[40%] -right-[15%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-bl from-teal-900/20 via-cyan-900/10 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-emerald-950/15 via-blue-950/10 to-transparent blur-[120px] pointer-events-none" />

      {/* Floating Stardust Particles Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-70"
      />
    </div>
  )
}
