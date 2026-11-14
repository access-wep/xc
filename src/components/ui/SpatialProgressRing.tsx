'use client'

import React from 'react'

export interface SpatialProgressRingProps {
  percentage: number
  size?: number
  strokeWidth?: number
  glowColor?: 'indigo' | 'cyan' | 'emerald' | 'amber'
  className?: string
  showText?: boolean
}

export function SpatialProgressRing({
  percentage = 0,
  size = 72,
  strokeWidth = 6,
  glowColor = 'emerald',
  className = '',
  showText = true,
}: SpatialProgressRingProps) {
  const clampedPercentage = Math.max(0, Math.min(100, Math.round(percentage)))
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (clampedPercentage / 100) * circumference

  const colorMap = {
    indigo: {
      gradientId: 'grad-indigo',
      start: '#818cf8',
      end: '#6366f1',
      shadow: 'rgba(99, 102, 241, 0.5)',
      textColor: 'text-indigo-400',
    },
    cyan: {
      gradientId: 'grad-cyan',
      start: '#38bdf8',
      end: '#06b6d4',
      shadow: 'rgba(6, 182, 212, 0.5)',
      textColor: 'text-cyan-400',
    },
    emerald: {
      gradientId: 'grad-emerald',
      start: '#34d399',
      end: '#10b981',
      shadow: 'rgba(16, 185, 129, 0.5)',
      textColor: 'text-emerald-400',
    },
    amber: {
      gradientId: 'grad-amber',
      start: '#fbbf24',
      end: '#f59e0b',
      shadow: 'rgba(245, 158, 11, 0.5)',
      textColor: 'text-amber-400',
    },
  }[glowColor]

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id={colorMap.gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorMap.start} />
            <stop offset="100%" stopColor={colorMap.end} />
          </linearGradient>
          <filter id={`glow-${glowColor}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-white/10 dark:text-slate-800"
          fill="transparent"
        />

        {/* Animated Progress Arc with 3D Neon Glow */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${colorMap.gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          filter={`url(#glow-${glowColor})`}
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Centered Percentage Label */}
      {showText && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className={`text-xs font-black font-cairo ${colorMap.textColor}`}>
            {clampedPercentage}%
          </span>
        </div>
      )}
    </div>
  )
}
