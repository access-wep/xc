'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { useCurrency } from '@/contexts/CurrencyContext'
import { CurrencySelector } from '@/components/CurrencySelector'
import {
  Check,
  CheckCircle2,
  Sparkles,
  Flame,
  Target,
  Hourglass,
  Calendar,
  Search,
  Menu,
  Shield,
  Zap,
  Award,
  Activity,
  Layers,
  BarChart3,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'

export default function FekrtoLanding() {
  const { user } = useAuth()
  const { formatPrice } = useCurrency()

  // Dynamic progress & interactive states from video
  const [progress, setProgress] = useState(78)
  const [selectedDay, setSelectedDay] = useState(6) // السبت 26
  const [completedBadgeVisible, setCompletedBadgeVisible] = useState(false)
  const [showLaserBeams, setShowLaserBeams] = useState(false)
  const [activePlan, setActivePlan] = useState<'annual' | 'monthly' | 'free'>('monthly')

  // Tasks matching the video items
  const [tasks, setTasks] = useState([
    { id: 1, title: 'إنجاز مهام العميل', day: 'السبت', completed: true, priority: 'مستمرة' },
    { id: 2, title: 'مراجعة تقرير المشروع', day: 'الجمعة', completed: false, priority: 'عاجلة' },
    { id: 3, title: 'مراجعة العروض التسويقية', day: 'الأربعاء', completed: true, priority: 'عالية' },
  ])

  const daysList = [
    { name: 'الأحد', date: '20' },
    { name: 'الإثنين', date: '21' },
    { name: 'الثلاثاء', date: '22' },
    { name: 'الأربعاء', date: '23' },
    { name: 'الخميس', date: '24' },
    { name: 'الجمعة', date: '25' },
    { name: 'السبت', date: '26' },
  ]

  // Toggle task completion with celebratory trigger matching the video
  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextState = !t.completed
          if (nextState) {
            // Trigger floating celebratory "مكتملة ✓" badge
            setCompletedBadgeVisible(true)
            setTimeout(() => setCompletedBadgeVisible(false), 2400)

            // Increment progress towards 100%
            setProgress((curr) => {
              const updated = Math.min(100, curr + 7)
              if (updated >= 100) {
                setShowLaserBeams(true)
                setTimeout(() => setShowLaserBeams(false), 4500)
              }
              return updated
            })
          }
          return { ...t, completed: nextState }
        }
        return t
      })
    )
  }

  // Interactive 3D Canvas Energy Core
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const size = 380
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    const centerX = size / 2
    const centerY = size / 2
    let angleX = 0
    let angleY = 0
    let angleEquatorial = 0
    let tick = 0

    const particleCount = 28
    const particles = Array.from({ length: particleCount }, (_, idx) => ({
      angle: (idx / particleCount) * Math.PI * 2,
      orbit: idx % 4,
      speed: 0.018 + (idx % 3) * 0.006,
      size: 1.2 + (idx % 2) * 1,
      color: ['#22d3ee', '#ec4899', '#fbbf24', '#34d399'][idx % 4],
    }))

    const render = () => {
      tick++
      ctx.clearRect(0, 0, size, size)

      const speedFactor = 1 + (progress / 100) * 0.8
      angleX += 0.014 * speedFactor
      angleY += 0.018 * speedFactor
      angleEquatorial += 0.008 * speedFactor

      // 1. Ambient Central Glow
      const glowGrad = ctx.createRadialGradient(centerX, centerY, 15, centerX, centerY, size * 0.46)
      glowGrad.addColorStop(0, 'rgba(34, 211, 238, 0.5)')
      glowGrad.addColorStop(0.3, 'rgba(168, 85, 247, 0.25)')
      glowGrad.addColorStop(0.65, 'rgba(236, 72, 153, 0.12)')
      glowGrad.addColorStop(1, 'rgba(0,0,0,0)')

      ctx.fillStyle = glowGrad
      ctx.beginPath()
      ctx.arc(centerX, centerY, size * 0.46, 0, Math.PI * 2)
      ctx.fill()

      // 2. Equatorial Galaxy Track
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.scale(1, 0.3)
      ctx.rotate(angleEquatorial * 0.2)

      ctx.beginPath()
      ctx.arc(0, 0, size * 0.42, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.4)'
      ctx.lineWidth = 1.5
      ctx.shadowColor = '#22d3ee'
      ctx.shadowBlur = 10
      ctx.stroke()
      ctx.restore()

      // 3. Tilted 3D Quantum Orbital Rings
      const orbits = [
        { rotX: 0.85, rotZ: angleX, color: '#22d3ee', r: size * 0.36, w: 2 },
        { rotX: -0.75, rotZ: -angleY, color: '#ec4899', r: size * 0.34, w: 1.8 },
        { rotX: 0.35, rotZ: angleX * 1.3, color: '#fbbf24', r: size * 0.38, w: 1.6 },
        { rotX: -1.1, rotZ: angleY * 0.8, color: '#34d399', r: size * 0.32, w: 1.5 },
      ]

      orbits.forEach((orb) => {
        ctx.save()
        ctx.translate(centerX, centerY)
        ctx.rotate(orb.rotZ)
        ctx.scale(1, Math.cos(orb.rotX))
        ctx.beginPath()
        ctx.arc(0, 0, orb.r, 0, Math.PI * 2)
        ctx.strokeStyle = orb.color
        ctx.lineWidth = orb.w
        ctx.shadowColor = orb.color
        ctx.shadowBlur = 12
        ctx.stroke()
        ctx.restore()
      })

      // 4. Orbiting Photons / Particles
      particles.forEach((p) => {
        p.angle += p.speed * speedFactor
        const currentOrb = orbits[p.orbit]
        const px = Math.cos(p.angle) * currentOrb.r
        const py = Math.sin(p.angle) * currentOrb.r * Math.cos(currentOrb.rotX)

        ctx.save()
        ctx.translate(centerX, centerY)
        ctx.rotate(currentOrb.rotZ)
        ctx.beginPath()
        ctx.arc(px, py, p.size, 0, Math.PI * 2)
        ctx.fillStyle = '#ffffff'
        ctx.shadowColor = p.color
        ctx.shadowBlur = 8
        ctx.fill()
        ctx.restore()
      })

      // 5. Pulsing Quantum Star Nucleus
      const corePulse = Math.sin(tick * 0.08) * 4
      const coreR = Math.max(14, 20 + (progress / 100) * 8 + corePulse)

      const coreGrad = ctx.createRadialGradient(centerX, centerY, 2, centerX, centerY, coreR)
      coreGrad.addColorStop(0, '#ffffff')
      coreGrad.addColorStop(0.35, '#a5f3fc')
      coreGrad.addColorStop(0.7, '#06b6d4')
      coreGrad.addColorStop(1, 'rgba(8, 145, 178, 0)')

      ctx.fillStyle = coreGrad
      ctx.beginPath()
      ctx.arc(centerX, centerY, coreR, 0, Math.PI * 2)
      ctx.shadowColor = '#22d3ee'
      ctx.shadowBlur = 20
      ctx.fill()

      animId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animId)
    }
  }, [progress])

  return (
    <main className="relative min-h-screen bg-[#020617] text-white overflow-x-hidden font-sans rtl selection:bg-cyan-500 selection:text-slate-950 flex flex-col justify-between">
      {/* ========================================================================= */}
      {/* الخلفية الكونية الحية (Cosmic Nebula & Neural Filaments & Stars)             */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Ambient Cosmic Radial Glows */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[650px] h-[650px] bg-purple-600/10 rounded-full blur-[130px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px]" />

        {/* Dynamic Star Field Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:48px_48px] opacity-20" />

        {/* Neural Network Circuit Lines (Connecting Left, Center & Right) */}
        <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none">
          <defs>
            <linearGradient id="neuralGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <path
            d="M 200,340 Q 500,280 640,360 T 1100,320"
            fill="none"
            stroke="url(#neuralGrad1)"
            strokeWidth="1.5"
            strokeDasharray="6 6"
          />
          <path
            d="M 250,420 Q 550,480 640,380 T 1050,440"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="1"
            strokeOpacity="0.4"
          />
        </svg>

        {/* Vertical Upward Laser Beams (Fires on 100% Progress as seen in video) */}
        {showLaserBeams && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            {/* Center Super Cyan Beam */}
            <div className="w-8 h-screen bg-gradient-to-t from-cyan-400 via-teal-300 to-transparent blur-md opacity-90 animate-pulse" />
            {/* Flanking Magenta Beam */}
            <div className="w-4 h-screen bg-gradient-to-t from-pink-500 via-purple-400 to-transparent blur-md opacity-80 -translate-x-12" />
            {/* Flanking Gold Beam */}
            <div className="w-4 h-screen bg-gradient-to-t from-amber-400 via-yellow-300 to-transparent blur-md opacity-80 translate-x-12" />
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 1. الشريط العلوي العائم الزجاجي (Top Glass HUD Navbar)                     */}
      {/* ========================================================================= */}
      <header className="relative z-50 px-4 sm:px-8 pt-4">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3.5 rounded-2xl bg-slate-950/70 border border-white/10 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
          {/* Right Side: Glowing Logo with Ribbon Icon (matching video) */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)] group-hover:scale-105 transition-transform">
              <span className="font-black text-xl text-slate-950">ف</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-wide bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent font-cairo">
                فكرتو
              </span>
            </div>
          </Link>

          {/* Center Links (matching video: تطوير, المراجعة, الإحصائيات, الأمان, الباقات) */}
          <div className="hidden lg:flex items-center gap-7 text-xs font-bold text-gray-300 font-cairo">
            <Link href="/" className="hover:text-cyan-300 transition-colors">
              الرئيسية
            </Link>
            <Link href="#features" className="hover:text-cyan-300 transition-colors">
              تطوير
            </Link>
            <Link href="#features" className="hover:text-cyan-300 transition-colors">
              المراجعة
            </Link>
            <Link href="/dashboard" className="hover:text-cyan-300 transition-colors">
              الإحصائيات
            </Link>
            <Link href="/terms" className="hover:text-cyan-300 transition-colors">
              الأمان والضمان
            </Link>
            <Link href="/dashboard/subscription" className="hover:text-cyan-300 transition-colors">
              الباقات
            </Link>
          </div>

          {/* Left Side: Currency Selector & Auth Quick Actions / Fekrto Hamburger */}
          <div className="flex items-center gap-3">
            <CurrencySelector compact />
            {user ? (
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 text-xs font-black shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:scale-105 active:scale-95 transition-all font-cairo"
              >
                لوحة التحكم
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-3.5 py-1.5 text-xs font-bold text-gray-300 hover:text-white transition-colors font-cairo"
                >
                  دخول
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 text-slate-950 text-xs font-black shadow-[0_0_15px_rgba(34,211,238,0.35)] hover:scale-105 active:scale-95 transition-all font-cairo"
                >
                  ابدأ الآن
                </Link>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* ========================================================================= */}
      {/* 2. القسم البانورامي الرئيسي ثلاثي الأبعاد (The 3D Hero Master Stage)       */}
      {/* ========================================================================= */}
      <section className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-8 lg:py-12 flex flex-col justify-center w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* --------------------------------------------------------------------- */}
          {/* A. العمود الأيمن (Right in RTL - 4 Cols): العنوان الكبير والباقات وطرق الدفع */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-4 space-y-6 text-right order-1 lg:order-1">
            {/* Top Glowing Ribbon Medal Badge (Exact SVG medal with hanging ribbon tails from video) */}
            <div className="relative inline-block">
              <svg width="64" height="74" viewBox="0 0 64 74" fill="none" className="filter drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                {/* Ribbon Left Tail */}
                <path d="M22 46L16 68L28 62L34 52" fill="#7e22ce" stroke="#c084fc" strokeWidth="1.5" />
                {/* Ribbon Right Tail */}
                <path d="M42 46L48 68L36 62L30 52" fill="#6b21a8" stroke="#a855f7" strokeWidth="1.5" />
                {/* Center Medal Ring */}
                <circle cx="32" cy="30" r="24" fill="url(#medalGrad)" stroke="#c084fc" strokeWidth="2.5" />
                {/* Inner Star / Check Icon */}
                <path
                  d="M24 30L29.5 35.5L40 25"
                  stroke="#ffffff"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient id="medalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="50%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#4c1d95" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Platform Title */}
            <div>
              <span className="text-xl sm:text-2xl font-black text-cyan-300 font-cairo block tracking-wide">
                فكرتو
              </span>

              {/* Main Headline (Exact text from the video) */}
              <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black text-white leading-[1.25] tracking-tight font-cairo mt-2">
                نظم يومك ومهامك{' '}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-indigo-300">
                  بوعي وإتقان، وتفان،
                </span>
                <span className="block text-2xl sm:text-3xl xl:text-4xl text-gray-200 mt-1 font-extrabold">
                  وعش إنتاجية حقيقية
                </span>
                <span className="block text-xl sm:text-2xl text-gray-400 font-medium">
                  خالية من الفوضى
                </span>
              </h1>
            </div>

            {/* Pricing Badges/Cards Row (السنوية, الباقة الاحترافية, الباقة المجانية) */}
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              {/* Plan 1: السنوية */}
              <Link
                href="/dashboard/subscription"
                onClick={() => setActivePlan('annual')}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer backdrop-blur-xl ${
                  activePlan === 'annual'
                    ? 'bg-slate-900/90 border-cyan-400/60 shadow-[0_0_15px_rgba(34,211,238,0.25)] scale-[1.02]'
                    : 'bg-slate-950/60 border-white/10 hover:border-white/20'
                }`}
              >
                <span className="text-[11px] font-bold text-gray-300 font-cairo block">
                  السنوية
                </span>
                <span className="text-xs font-black text-cyan-300 font-cairo block mt-0.5">
                  وفر 30%
                </span>
              </Link>

              {/* Plan 2: الباقة الاحترافية الشهرية */}
              <Link
                href="/dashboard/subscription"
                onClick={() => setActivePlan('monthly')}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer backdrop-blur-xl ${
                  activePlan === 'monthly'
                    ? 'bg-slate-900/90 border-cyan-400/80 shadow-[0_0_20px_rgba(34,211,238,0.35)] scale-[1.02]'
                    : 'bg-slate-950/60 border-white/10 hover:border-white/20'
                }`}
              >
                <span className="text-[10px] font-bold text-gray-200 font-cairo block">
                  الباقة الاحترافية
                </span>
                <span className="text-xs font-black text-white font-cairo block mt-0.5">
                  29 ر.س <span className="text-[9px] text-gray-400 font-normal">/ شهرياً</span>
                </span>
              </Link>

              {/* Plan 3: الباقة المجانية */}
              <Link
                href="/auth/register"
                onClick={() => setActivePlan('free')}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer backdrop-blur-xl ${
                  activePlan === 'free'
                    ? 'bg-slate-900/90 border-cyan-400/60 shadow-[0_0_15px_rgba(34,211,238,0.25)] scale-[1.02]'
                    : 'bg-slate-950/60 border-white/10 hover:border-white/20'
                }`}
              >
                <span className="text-[10px] font-bold text-gray-300 font-cairo block">
                  الباقة المجانية
                </span>
                <span className="text-xs font-black text-gray-200 font-cairo block mt-0.5">
                  0 ر.س
                </span>
              </Link>
            </div>

            {/* Payment Methods Pill (mada, VISA, Mastercard, Apple Pay - matching video) */}
            <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-white/10 backdrop-blur-xl flex items-center justify-around gap-2 shadow-lg">
              {/* mada */}
              <div className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 flex items-center gap-1">
                <span className="text-[10px] font-bold text-emerald-400">مدى</span>
                <span className="text-[9px] font-extrabold text-cyan-300">mada</span>
              </div>
              {/* VISA */}
              <div className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
                <span className="text-[11px] font-black italic tracking-wider text-blue-400">VISA</span>
              </div>
              {/* Mastercard */}
              <div className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 flex items-center gap-0.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 opacity-90" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 -mr-1.5 opacity-90" />
              </div>
              {/* Apple Pay */}
              <div className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 flex items-center gap-1">
                <span className="text-[11px] font-bold text-white"> Pay</span>
              </div>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* B. المنتصف (Center - 4 Cols): نواة الطاقة ثلاثية الأبعاد (Interactive Core) */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-4 flex items-center justify-center relative order-2 lg:order-2 py-4">
            {/* Ground Reflected Neon Glow */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-12 bg-cyan-500/25 rounded-full blur-2xl pointer-events-none" />

            {/* 3D WebGL Canvas Reactor */}
            <div className="relative">
              <canvas
                ref={canvasRef}
                className="w-72 h-72 sm:w-80 sm:h-80 mx-auto select-none cursor-grab active:cursor-grabbing"
              />
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* C. العمود الأيسر (Left in RTL - 4 Cols): المخطط الأسبوعي ونسبة الإنجاز */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-4 space-y-4 order-3 lg:order-3">
            {/* Upper Split: Weekly Planner (Right in RTL / near Core) + Circular Gauge (Left in RTL / Far Left) */}
            <div className="grid grid-cols-12 gap-3 items-stretch">
              
              {/* 1. The Weekly Planner Card (المخطط الأسبوعي) - Placed near core */}
              <div className="col-span-8 p-4 rounded-3xl bg-slate-900/60 border border-cyan-500/30 backdrop-blur-2xl shadow-[0_0_25px_rgba(34,211,238,0.2)] flex flex-col justify-between relative overflow-hidden">
                
                {/* Floating "مكتملة ✓" Badge Animation (Matching the video) */}
                <AnimatePresence>
                  {completedBadgeVisible && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -10 }}
                      className="absolute inset-0 m-auto w-36 h-12 z-30 rounded-2xl bg-emerald-500/90 border-2 border-emerald-300 shadow-[0_0_30px_#10b981] flex items-center justify-center gap-2 text-slate-950 font-black font-cairo text-sm pointer-events-none"
                    >
                      <CheckCircle2 className="w-5 h-5 stroke-[3]" />
                      <span>مكتملة ✓</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Top Row: Search Icon + Title */}
                <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                  <div className="p-1 rounded-lg bg-white/5 border border-white/10 text-gray-400">
                    <Search className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-cyan-300 font-cairo">
                    المخطط الأسبوعي
                  </span>
                </div>

                {/* 7 Days Row (الأحد 20 - السبت 26) */}
                <div className="grid grid-cols-7 gap-1 py-2.5">
                  {daysList.map((d, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedDay(idx)}
                      className={`py-1.5 px-0.5 rounded-xl border text-center transition-all ${
                        selectedDay === idx
                          ? 'bg-cyan-500/25 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.3)] scale-105'
                          : 'bg-slate-950/40 border-white/5 text-gray-400 hover:border-white/10'
                      }`}
                    >
                      <span className="text-[9px] block leading-tight font-cairo">{d.name}</span>
                      <span className="text-[11px] font-black block font-cairo mt-0.5">{d.date}</span>
                    </button>
                  ))}
                </div>

                {/* Animated Heartbeat / ECG Soundwave Visual (Seen in video) */}
                <div className="py-1">
                  <svg className="w-full h-7" viewBox="0 0 200 30" fill="none">
                    <path
                      d="M0 15 L 40 15 L 50 5 L 60 25 L 70 10 L 80 20 L 90 15 L 140 15 L 150 7 L 160 23 L 170 15 L 200 15"
                      stroke="#22d3ee"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="animate-pulse"
                      filter="drop-shadow(0 0 4px #06b6d4)"
                    />
                  </svg>
                </div>

                {/* Interactive Task Checklist */}
                <div className="space-y-1.5 pt-1">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer select-none transition-all ${
                        task.completed
                          ? 'bg-slate-950/50 border-cyan-500/30 text-gray-400'
                          : 'bg-slate-950/80 border-white/10 hover:border-cyan-400/50 text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                            task.completed
                              ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-[0_0_8px_#10b981]'
                              : 'border-white/20 bg-white/5'
                          }`}
                        >
                          {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span
                          className={`text-[11px] font-bold font-cairo ${
                            task.completed ? 'line-through text-gray-500' : 'text-gray-200'
                          }`}
                        >
                          {task.day}: {task.title}
                        </span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-white/5 text-cyan-300 border border-white/10 font-cairo">
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Circular Progress Gauge (Far Left in visual screen space) */}
              <div className="col-span-4 p-4 rounded-3xl bg-slate-900/60 border border-cyan-500/30 backdrop-blur-2xl shadow-[0_0_25px_rgba(34,211,238,0.2)] flex flex-col items-center justify-center relative overflow-hidden">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="7"
                      className="text-slate-800/80 fill-none"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="url(#progressGrad)"
                      strokeWidth="7"
                      strokeLinecap="round"
                      className="fill-none transition-all duration-700 ease-out"
                      strokeDasharray={251.32}
                      strokeDashoffset={251.32 * (1 - progress / 100)}
                    />
                    <defs>
                      <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#22d3ee" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="absolute text-2xl font-black font-cairo text-white tracking-tighter drop-shadow-[0_0_10px_#22d3ee]">
                    {progress}%
                  </span>
                </div>
                <span className="text-[11px] font-bold text-gray-300 mt-2 font-cairo whitespace-nowrap">
                  إجمالي الإنجاز
                </span>
              </div>

            </div>

            {/* 3 Bottom Feature Cards (Matching video ordering from right to left in RTL: إدارة مهام سهلة, تنظيم ذكي للوقت, تحقيق أهدافك) */}
            <div className="grid grid-cols-3 gap-2.5">
              {/* Feature 1 (Right): إدارة مهام سهلة */}
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-cyan-500/30 backdrop-blur-xl flex flex-col items-center justify-center text-center shadow-[0_0_15px_rgba(34,211,238,0.15)] group hover:scale-105 transition-all">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-400 flex items-center justify-center mb-1.5 shadow-[0_0_10px_rgba(34,211,238,0.25)]">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-gray-200 font-cairo">
                  إدارة مهام سهلة
                </span>
              </div>

              {/* Feature 2 (Middle): تنظيم ذكي للوقت */}
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-purple-500/30 backdrop-blur-xl flex flex-col items-center justify-center text-center shadow-[0_0_15px_rgba(168,85,247,0.15)] group hover:scale-105 transition-all">
                <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-400/30 text-purple-400 flex items-center justify-center mb-1.5 shadow-[0_0_10px_rgba(168,85,247,0.25)]">
                  <Hourglass className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-gray-200 font-cairo">
                  تنظيم ذكي للوقت
                </span>
              </div>

              {/* Feature 3 (Left): تحقيق أهدافك */}
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-purple-500/30 backdrop-blur-xl flex flex-col items-center justify-center text-center shadow-[0_0_15px_rgba(168,85,247,0.15)] group hover:scale-105 transition-all">
                <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-400/30 text-purple-400 flex items-center justify-center mb-1.5 shadow-[0_0_10px_rgba(168,85,247,0.25)]">
                  <Target className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-gray-200 font-cairo">
                  تحقيق أهدافك
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. شريط تذييل ناعم ومباشر (Clean Bottom Micro-Footer)                       */}
      {/* ========================================================================= */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-4 w-full flex items-center justify-between text-[11px] text-gray-500 border-t border-white/5 font-cairo">
        <span>© {new Date().getFullYear()} فكرتو (Fekrto). جميع الحقوق محفوظة.</span>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-cyan-400 transition-colors">
            سياسة الخصوصية
          </Link>
          <Link href="/terms" className="hover:text-cyan-400 transition-colors">
            الشروط والأحكام
          </Link>
          <Link href="/contact" className="hover:text-cyan-400 transition-colors">
            الدعم والمساعدة
          </Link>
        </div>
      </footer>
    </main>
  )
}
