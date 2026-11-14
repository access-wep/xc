'use client'

import React from 'react'

// 1. 3D Glowing Document Icon (إجمالي المهام) - Cyan Neon
export function VisualDocIcon() {
  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      {/* Cyan Ambient Glow */}
      <div className="absolute inset-0 bg-cyan-500/20 rounded-2xl blur-xl pointer-events-none" />

      {/* Layered 3D Document Body */}
      <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
        <defs>
          <linearGradient id="docGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
          <filter id="docGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Back Stack Sheet */}
        <rect
          x="18"
          y="10"
          width="36"
          height="46"
          rx="6"
          fill="#0c4a6e"
          stroke="#0284c7"
          strokeWidth="1.5"
          opacity="0.6"
          transform="rotate(6 36 33)"
        />

        {/* Main Front Document Sheet */}
        <rect
          x="15"
          y="11"
          width="36"
          height="46"
          rx="7"
          fill="url(#docGrad)"
          stroke="#7dd3fc"
          strokeWidth="1.8"
          filter="url(#docGlow)"
        />

        {/* Document Text Lines */}
        <line x1="22" y1="23" x2="44" y2="23" stroke="#e0f2fe" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="22" y1="30" x2="44" y2="30" stroke="#bae6fd" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="22" y1="37" x2="38" y2="37" stroke="#bae6fd" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="22" y1="44" x2="32" y2="44" stroke="#7dd3fc" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </div>
  )
}

// 2. 3D Glowing Checkmark Disc (المهام المنجزة) - Emerald Neon
export function VisualCheckIcon() {
  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      {/* Emerald Ambient Glow */}
      <div className="absolute inset-0 bg-emerald-500/25 rounded-full blur-xl pointer-events-none" />

      {/* 3D Embossed Shield Disc */}
      <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
        <defs>
          <linearGradient id="checkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <filter id="checkGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Shadow Rim */}
        <circle cx="34" cy="34" r="27" fill="#064e3b" stroke="#10b981" strokeWidth="2" opacity="0.8" />

        {/* Inner 3D Disc */}
        <circle cx="34" cy="34" r="23" fill="url(#checkGrad)" stroke="#a7f3d0" strokeWidth="1.8" filter="url(#checkGlow)" />

        {/* Thick Embossed Checkmark */}
        <path
          d="M24 34.5L30.5 41L44 27"
          stroke="#ffffff"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}

// 3. 3D Glowing Chronometer / Gear Clock (المهام الحالية) - Amber/Orange Neon
export function VisualClockIcon() {
  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      {/* Amber Ambient Glow */}
      <div className="absolute inset-0 bg-amber-500/25 rounded-full blur-xl pointer-events-none" />

      {/* 3D Gear / Clock Gauge */}
      <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
        <defs>
          <linearGradient id="clockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <filter id="clockGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Gear Teeth Silhouette */}
        <circle cx="34" cy="34" r="27" stroke="#d97706" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />

        {/* Main Clock Dial Disc */}
        <circle cx="34" cy="34" r="24" fill="url(#clockGrad)" stroke="#fef08a" strokeWidth="2" filter="url(#clockGlow)" />

        {/* Dial Inner Track */}
        <circle cx="34" cy="34" r="18" fill="#78350f" opacity="0.5" stroke="#fcd34d" strokeWidth="1.2" />

        {/* Hour & Minute Hands with Center Pin */}
        <line x1="34" y1="34" x2="34" y2="23" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
        <line x1="34" y1="34" x2="43" y2="34" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="34" cy="34" r="3" fill="#ffffff" />
      </svg>
    </div>
  )
}

// 4. 3D Glowing Fluid Plasma Wave Ring (نسبة الإنجاز) - Purple/Pink Neon
export function VisualLiquidRingIcon({ percentage }: { percentage: number }) {
  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      {/* Purple Ambient Glow */}
      <div className="absolute inset-0 bg-purple-500/25 rounded-full blur-xl pointer-events-none" />

      <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
        <defs>
          <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <filter id="liquidGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Wave Contour Ring */}
        <path
          d="M34 8C48.3594 8 60 19.6406 60 34C60 48.3594 48.3594 60 34 60C19.6406 60 8 48.3594 8 34C8 19.6406 19.6406 8 34 8Z"
          stroke="url(#liquidGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          filter="url(#liquidGlow)"
        />

        {/* Inner Wave Accent */}
        <circle cx="34" cy="34" r="18" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.7" />
      </svg>

      {/* Center Percentage Display */}
      <span className="absolute text-xs font-black font-cairo text-white">
        {percentage}%
      </span>
    </div>
  )
}

// 5. 3D Holographic Floating Task Clipboard with Orbital Rings
export function HolographicClipboardVisual() {
  return (
    <div className="relative w-44 h-44 flex items-center justify-center select-none pointer-events-none">
      {/* Outer Cyan Energy Ring 1 */}
      <div className="absolute w-40 h-20 rounded-[100%] border border-cyan-400/50 -rotate-[22deg] animate-pulse-soft shadow-[0_0_15px_rgba(34,211,238,0.3)]" />
      
      {/* Outer Amber Energy Ring 2 */}
      <div className="absolute w-36 h-18 rounded-[100%] border border-amber-400/40 rotate-[28deg] shadow-[0_0_15px_rgba(251,191,36,0.25)]" />

      {/* Floating Stardust Photons */}
      <span className="absolute -top-2 left-8 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_10px_#22d3ee] animate-ping" />
      <span className="absolute bottom-2 right-6 w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_10px_#fbbf24] animate-ping" />
      <span className="absolute top-10 right-2 w-1.5 h-1.5 rounded-full bg-purple-300 shadow-[0_0_10px_#a855f7]" />

      {/* Center 3D Floating Clipboard Sheet */}
      <div className="relative w-24 h-32 rounded-2xl bg-gradient-to-b from-cyan-950/70 via-slate-900/80 to-slate-950/90 border-2 border-cyan-400/60 shadow-[0_0_25px_rgba(34,211,238,0.35)] backdrop-blur-xl p-3 flex flex-col justify-between transform -rotate-3 hover:rotate-0 transition-transform duration-300">
        {/* Top Clip */}
        <div className="w-10 h-3 rounded-md bg-cyan-400 mx-auto -mt-4 shadow-[0_0_10px_#22d3ee] border border-white/40" />

        {/* Task Lines */}
        <div className="space-y-2 mt-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
            <div className="h-1.5 w-12 rounded bg-cyan-200/80" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
            <div className="h-1.5 w-10 rounded bg-cyan-300/60" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24]" />
            <div className="h-1.5 w-14 rounded bg-cyan-300/60" />
          </div>
        </div>

        {/* Bottom Sparkle Indicator */}
        <div className="h-1 w-8 rounded-full bg-cyan-400/50 mx-auto" />
      </div>
    </div>
  )
}
