'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Crown, Flame, Calendar, Award, CheckCircle2, TrendingUp } from 'lucide-react'
import { HabitIconRenderer } from './HabitIconRenderer'
import type { Habit } from '@/types/database'

interface HabitCommitmentGaugeCardProps {
  totalRate: number // Overall monthly commitment %
  activeHabitsCount: number
  completionDaysCount: number
  remainingDaysCount: number
  currentStreak: number
  topHabits: Array<{
    habit: Habit
    rate: number
    completedDays: number
    targetDays: number
  }>
}

export function HabitCommitmentGaugeCard({
  totalRate,
  activeHabitsCount,
  completionDaysCount,
  remainingDaysCount,
  currentStreak,
  topHabits,
}: HabitCommitmentGaugeCardProps) {
  // Circular Progress calculations (Radius = 48, Circumference = 2 * PI * 48 = 301.6)
  const radius = 48
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (totalRate / 100) * circumference

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-slate-950/80 border border-cyan-500/30 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.7)] flex flex-col justify-between space-y-5 text-right">
      {/* Card Header: Title with Crown */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]">
          <Crown className="w-4 h-4 fill-amber-300" />
        </div>
        <h3 className="text-base font-black text-white font-cairo">
          نسبة الالتزام الكلية
        </h3>
      </div>

      {/* Main Circular Gauge Display */}
      <div className="flex items-center justify-center relative py-2">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
            {/* Background Track */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="9"
              fill="transparent"
            />
            {/* Animated Active Track */}
            <motion.circle
              cx="60"
              cy="60"
              r={radius}
              stroke="url(#gaugeGradient)"
              strokeWidth="9"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              strokeLinecap="round"
              fill="transparent"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.6))',
              }}
            />
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Text in Gauge */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black text-white font-cairo drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
              {totalRate}%
            </span>
            <span className="text-[11px] text-cyan-300/80 font-bold font-cairo">الكلية</span>
          </div>
        </div>
      </div>

      {/* 4 Quick Metric Pills matching reference design */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/10 flex items-center justify-between text-right">
          <span className="text-sm font-black text-white font-cairo">{activeHabitsCount}</span>
          <span className="text-[11px] text-gray-300 font-medium">عادة نشطة</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 flex items-center justify-between text-right shadow-[0_0_10px_rgba(16,185,129,0.15)]">
          <span className="text-sm font-black text-emerald-400 font-cairo">{completionDaysCount}</span>
          <span className="text-[11px] text-gray-300 font-medium">يوم إنجاز</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-amber-500/30 flex items-center justify-between text-right shadow-[0_0_10px_rgba(245,158,11,0.15)]">
          <span className="text-sm font-black text-amber-400 font-cairo flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            <span>{currentStreak}</span>
          </span>
          <span className="text-[11px] text-gray-300 font-medium">سلسلة متواصلة</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/10 flex items-center justify-between text-right">
          <span className="text-sm font-black text-cyan-400 font-cairo">{remainingDaysCount}</span>
          <span className="text-[11px] text-gray-300 font-medium">أيام متبقية</span>
        </div>
      </div>

      {/* Section: أكثر العادات تحقيقاً */}
      <div className="space-y-3 pt-2 border-t border-white/10">
        <div className="flex items-center justify-between text-xs font-bold text-gray-300">
          <span className="text-[11px] text-cyan-400">نسبة التحقيق</span>
          <span className="font-cairo">أكثر العادات تحقيقاً</span>
        </div>

        {topHabits.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-2">
            حدد عاداتك المنجزة لتظهر إحصائياتك هنا
          </p>
        ) : (
          <div className="space-y-2.5">
            {topHabits.slice(0, 3).map((item) => (
              <div key={item.habit.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-xs font-bold text-cyan-300 font-cairo">
                    {item.rate}%
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs truncate max-w-[120px]">
                      {item.habit.name}
                    </span>
                    <div
                      className="w-5 h-5 rounded-md flex items-center justify-center text-slate-950 text-[10px]"
                      style={{ backgroundColor: item.habit.color || '#10b981' }}
                    >
                      <HabitIconRenderer name={item.habit.icon} className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </div>

                {/* Mini Progress Bar */}
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.rate}%` }}
                    transition={{ duration: 0.8 }}
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: item.habit.color || '#22d3ee',
                      boxShadow: `0 0 8px ${item.habit.color || '#22d3ee'}`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
