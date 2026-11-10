'use client'

import React from 'react'
import { Check, X, Flame } from 'lucide-react'

interface KPIStatsBarProps {
  completionRate: number
  completedCount: number
  remainingCount: number
  cancelledCount: number
  streakDays: number
  dateLabel?: string
}

export function KPIStatsBar({
  completionRate,
  completedCount,
  remainingCount,
  cancelledCount,
  streakDays,
  dateLabel = 'نسبة الإنجاز اليومية',
}: KPIStatsBarProps) {
  // SVG circular progress calculation
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (completionRate / 100) * circumference

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      {/* 1. Circular Completion Ring Card */}
      <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex items-center justify-between gap-3 text-white">
        <div className="text-right">
          <div className="text-[11px] text-slate-400 font-medium">{dateLabel}</div>
          <div className="text-2xl font-black text-teal-400 tracking-tight mt-0.5">
            {completionRate}%
          </div>
        </div>

        {/* Circular Progress Indicator */}
        <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
          <svg className="w-16 h-16 -rotate-90">
            <circle
              cx="32"
              cy="32"
              r={radius}
              stroke="currentColor"
              strokeWidth="5"
              className="text-slate-800"
              fill="transparent"
            />
            <circle
              cx="32"
              cy="32"
              r={radius}
              stroke="currentColor"
              strokeWidth="5"
              className="text-teal-400 transition-all duration-700 ease-out"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute text-xs font-bold text-teal-300">
            {completionRate}%
          </span>
        </div>
      </div>

      {/* 2. Completed Count Card */}
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex items-center gap-3 text-white">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
          <Check className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <div className="text-xl font-black text-white">{completedCount}</div>
          <div className="text-[11px] text-slate-400 font-medium">مكتملة</div>
        </div>
      </div>

      {/* 3. Remaining Count Card */}
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex items-center gap-3 text-white">
        <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center flex-shrink-0">
          <Check className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <div className="text-xl font-black text-white">{remainingCount}</div>
          <div className="text-[11px] text-slate-400 font-medium">متبقية</div>
        </div>
      </div>

      {/* 4. Cancelled Count Card */}
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex items-center gap-3 text-white">
        <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0">
          <X className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div>
          <div className="text-xl font-black text-white">{cancelledCount}</div>
          <div className="text-[11px] text-slate-400 font-medium">ملغاة</div>
        </div>
      </div>

      {/* 5. Streak Flame Card */}
      <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex items-center justify-between gap-2 text-white">
        <div>
          <div className="text-[11px] text-slate-400 font-medium">سلسلة الالتزام</div>
          <div className="text-lg font-black text-amber-400 tracking-tight mt-0.5">
            {streakDays} {streakDays === 1 ? 'يوم' : 'أيام متتالية'}
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
          <Flame className="w-6 h-6 fill-amber-500 text-amber-500 animate-pulse" />
        </div>
      </div>
    </div>
  )
}
