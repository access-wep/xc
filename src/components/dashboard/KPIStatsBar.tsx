'use client'

import React from 'react'
import { Check, Clock, X, Flame } from 'lucide-react'
import { SpatialCard } from '@/components/ui/SpatialCard'
import { SpatialProgressRing } from '@/components/ui/SpatialProgressRing'

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
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
      {/* 1. Spatial 3D Circular Completion Ring Card */}
      <SpatialCard
        neonGlow="emerald"
        tiltEnabled={true}
        popZ={20}
        className="col-span-2 sm:col-span-1 p-4"
      >
        <div className="flex items-center justify-between gap-3 text-white h-full">
          <div className="text-right">
            <div className="text-[11px] text-gray-400 font-medium">{dateLabel}</div>
            <div className="text-2xl font-black text-emerald-400 tracking-tight mt-0.5 font-cairo">
              {completionRate}%
            </div>
          </div>
          <SpatialProgressRing
            percentage={completionRate}
            size={58}
            strokeWidth={5.5}
            glowColor="emerald"
          />
        </div>
      </SpatialCard>

      {/* 2. Completed Count Card */}
      <SpatialCard
        neonGlow="emerald"
        tiltEnabled={true}
        popZ={22}
        className="p-4"
      >
        <div className="flex items-center gap-3 text-white h-full">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Check className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-2xl font-black text-white font-cairo">{completedCount}</div>
            <div className="text-[11px] text-gray-400 font-medium">مهام مكتملة</div>
          </div>
        </div>
      </SpatialCard>

      {/* 3. Remaining Count Card */}
      <SpatialCard
        neonGlow="cyan"
        tiltEnabled={true}
        popZ={22}
        className="p-4"
      >
        <div className="flex items-center gap-3 text-white h-full">
          <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            <Clock className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-2xl font-black text-white font-cairo">{remainingCount}</div>
            <div className="text-[11px] text-gray-400 font-medium">مهام متبقية</div>
          </div>
        </div>
      </SpatialCard>

      {/* 4. Cancelled Count Card */}
      <SpatialCard
        neonGlow="none"
        tiltEnabled={true}
        popZ={20}
        className="p-4"
      >
        <div className="flex items-center gap-3 text-white h-full">
          <div className="w-11 h-11 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(244,63,94,0.15)]">
            <X className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-2xl font-black text-white font-cairo">{cancelledCount}</div>
            <div className="text-[11px] text-gray-400 font-medium">مهام مستبعدة</div>
          </div>
        </div>
      </SpatialCard>

      {/* 5. Streak Flame Card */}
      <SpatialCard
        neonGlow="amber"
        tiltEnabled={true}
        popZ={24}
        className="col-span-2 sm:col-span-1 p-4"
      >
        <div className="flex items-center justify-between gap-2 text-white h-full">
          <div>
            <div className="text-[11px] text-gray-400 font-medium">سلسلة الالتزام</div>
            <div className="text-xl font-black text-amber-400 tracking-tight mt-0.5 font-cairo">
              {streakDays} {streakDays === 1 ? 'يوم' : 'أيام متتالية'}
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 shadow-[0_0_18px_rgba(245,158,11,0.3)]">
            <Flame className="w-6 h-6 fill-amber-500 text-amber-500 animate-pulse" />
          </div>
        </div>
      </SpatialCard>
    </div>
  )
}
