'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { PieChart, TrendingUp, Calendar, Crown, Sparkles } from 'lucide-react'
import type { Habit } from '@/types/database'

interface HabitsAnalyticsRowProps {
  habits: Habit[]
  habitLogs: Record<string, boolean>
  currentDate: Date
}

export function HabitsAnalyticsRow({
  habits,
  habitLogs,
  currentDate,
}: HabitsAnalyticsRowProps) {
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  // 1. Calculate Distribution (Completed, In Progress, Not Done)
  const distribution = useMemo(() => {
    let completedCount = 0
    let inProgressCount = 0
    let notStartedCount = 0

    habits.forEach((habit) => {
      let daysDone = 0
      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        if (habitLogs[`${habit.id}_${dateStr}`]) {
          daysDone++
        }
      }

      const target = habit.monthly_target || daysInMonth
      const rate = target > 0 ? (daysDone / target) * 100 : 0

      if (rate >= 80) {
        completedCount++
      } else if (rate > 20) {
        inProgressCount++
      } else {
        notStartedCount++
      }
    })

    const total = habits.length || 1
    const completedPct = Math.round((completedCount / total) * 100)
    const inProgressPct = Math.round((inProgressCount / total) * 100)
    const notDonePct = Math.max(0, 100 - completedPct - inProgressPct)

    return {
      completedPct: habits.length > 0 ? completedPct : 0,
      inProgressPct: habits.length > 0 ? inProgressPct : 0,
      notDonePct: habits.length > 0 ? notDonePct : 0,
      totalHabits: habits.length,
    }
  }, [habits, habitLogs, currentYear, currentMonth, daysInMonth])

  // 2. Weekly Commitment Evolution (Weeks 1 to 5)
  const weeklyEvolution = useMemo(() => {
    const weeks = [
      { name: 'الأسبوع 1', start: 1, end: 7 },
      { name: 'الأسبوع 2', start: 8, end: 14 },
      { name: 'الأسبوع 3', start: 15, end: 21 },
      { name: 'الأسبوع 4', start: 22, end: 28 },
      { name: 'الأسبوع 5', start: 29, end: daysInMonth },
    ]

    return weeks.map((w) => {
      let totalCells = 0
      let completedCells = 0

      for (let d = w.start; d <= Math.min(w.end, daysInMonth); d++) {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
        habits.forEach((h) => {
          totalCells++
          if (habitLogs[`${h.id}_${dateStr}`]) {
            completedCells++
          }
        })
      }

      const rate = totalCells > 0 ? Math.round((completedCells / totalCells) * 100) : 0
      return {
        name: w.name,
        rate,
      }
    })
  }, [habits, habitLogs, currentYear, currentMonth, daysInMonth])

  // 3. Monthly Heatmap Matrix (Day intensity 0 to 3)
  const heatmapData = useMemo(() => {
    const matrix: Array<{ day: number; intensity: number; label: string }> = []
    const totalHabits = habits.length || 1

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      let count = 0
      habits.forEach((h) => {
        if (habitLogs[`${h.id}_${dateStr}`]) {
          count++
        }
      })

      const ratio = count / totalHabits
      let intensity = 0 // 0 = inactive, 1 = low, 2 = medium, 3 = high
      if (count > 0) {
        if (ratio >= 0.7) intensity = 3
        else if (ratio >= 0.3) intensity = 2
        else intensity = 1
      }

      matrix.push({
        day,
        intensity,
        label: `يوم ${day}: ${count} عادات منجزة`,
      })
    }

    return matrix
  }, [habits, habitLogs, currentYear, currentMonth, daysInMonth])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* Card 1: توزيع الإنجازات (Donut Chart) */}
      <div className="p-5 rounded-3xl bg-slate-950/80 border border-cyan-500/20 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex flex-col justify-between space-y-4 text-right">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <PieChart className="w-4 h-4 text-cyan-400" />
          <h4 className="text-sm font-bold text-white font-cairo">توزيع الإنجازات</h4>
        </div>

        <div className="flex items-center justify-between gap-4 py-2">
          {/* Donut graphic */}
          <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="36"
                stroke="#1e293b"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="36"
                stroke="#22d3ee"
                strokeWidth="10"
                strokeDasharray="226"
                strokeDashoffset={226 - (226 * distribution.completedPct) / 100}
                strokeLinecap="round"
                fill="none"
                style={{ filter: 'drop-shadow(0 0 6px #22d3ee)' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] text-gray-400">إجمالي</span>
              <span className="text-xs font-black text-white font-cairo">
                {distribution.totalHabits} عادات
              </span>
            </div>
          </div>

          {/* Breakdown legend */}
          <div className="space-y-1.5 flex-1 text-right text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-cyan-300 font-mono">
                {distribution.completedPct}%
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-gray-300 text-[11px]">تم الإنجاز</span>
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-bold text-sky-400 font-mono">
                {distribution.inProgressPct}%
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-gray-300 text-[11px]">قيد التقدم</span>
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-[0_0_6px_#0284c7]" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-bold text-rose-400 font-mono">
                {distribution.notDonePct}%
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-gray-300 text-[11px]">لم يتم</span>
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_6px_#f43f5e]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: تطور الالتزام الشهري (Evolution Line Graph) */}
      <div className="p-5 rounded-3xl bg-slate-950/80 border border-cyan-500/20 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex flex-col justify-between space-y-3 text-right">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <TrendingUp className="w-4 h-4 text-teal-400" />
          <h4 className="text-sm font-bold text-white font-cairo">
            تطور الالتزام الشهري
          </h4>
        </div>

        {/* SVG Sparkline Graph */}
        <div className="h-28 w-full relative pt-2">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 200 80">
            {/* Horizontal Grid lines */}
            <line x1="0" y1="20" x2="200" y2="20" stroke="rgba(255,255,255,0.06)" strokeDasharray="3" />
            <line x1="0" y1="50" x2="200" y2="50" stroke="rgba(255,255,255,0.06)" strokeDasharray="3" />

            {/* Area Fill */}
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Line Points calculation */}
            {(() => {
              const pts = weeklyEvolution.map((w, idx) => {
                const x = 10 + (idx * 180) / (weeklyEvolution.length - 1)
                const y = 70 - (w.rate / 100) * 55
                return { x, y, rate: w.rate }
              })

              const pathD = pts.reduce(
                (acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`,
                ''
              )
              const areaD = `${pathD} L 190 75 L 10 75 Z`

              return (
                <>
                  <path d={areaD} fill="url(#areaGradient)" />
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="2.5"
                    style={{ filter: 'drop-shadow(0 0 6px #22d3ee)' }}
                  />
                  {pts.map((pt, i) => (
                    <circle
                      key={i}
                      cx={pt.x}
                      cy={pt.y}
                      r="3.5"
                      fill="#020617"
                      stroke="#38bdf8"
                      strokeWidth="2"
                    />
                  ))}
                </>
              )
            })()}
          </svg>

          {/* Week Labels */}
          <div className="flex items-center justify-between text-[9px] text-gray-400 pt-1 font-cairo">
            {weeklyEvolution.map((w, idx) => (
              <span key={idx}>{w.name.replace('الأسبوع ', 'أ')}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Card 3: خريطة النشاط الشهرية (Monthly Heatmap Matrix) */}
      <div className="p-5 rounded-3xl bg-slate-950/80 border border-cyan-500/20 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex flex-col justify-between space-y-3 text-right">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <h4 className="text-sm font-bold text-white font-cairo">
            خريطة النشاط الشهرية
          </h4>
        </div>

        {/* Heatmap Matrix Grid */}
        <div className="grid grid-cols-7 gap-1.5 py-1">
          {heatmapData.map((cell) => {
            let bgClass = 'bg-slate-900 border border-white/5'
            if (cell.intensity === 3) {
              bgClass = 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.7)]'
            } else if (cell.intensity === 2) {
              bgClass = 'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.5)]'
            } else if (cell.intensity === 1) {
              bgClass = 'bg-rose-500/80'
            }

            return (
              <div
                key={cell.day}
                className={`w-6 h-6 rounded-md flex items-center justify-center text-[9px] font-mono transition-transform hover:scale-125 cursor-pointer ${bgClass} ${
                  cell.intensity > 1 ? 'text-slate-950 font-black' : 'text-gray-400'
                }`}
                title={cell.label}
              >
                {cell.day}
              </div>
            )
          })}
        </div>

        {/* Heatmap Legend */}
        <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1 border-t border-white/5">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-cyan-400" />
            <span>نشط</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-amber-400" />
            <span>متوسط</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-rose-500" />
            <span>ضعيف</span>
          </div>
        </div>
      </div>

      {/* Card 4: بطاقة الحكمة والإلهام (Discipline is Freedom) */}
      <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-slate-950/80 shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex flex-col justify-between p-5 text-right group min-h-[160px]">
        {/* Background Artwork */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />

        <div className="relative z-10 flex items-center justify-between pb-2 border-b border-white/10">
          <Crown className="w-4 h-4 text-amber-300 fill-amber-300" />
          <span className="text-[11px] font-bold text-amber-300 font-cairo">
            تذكر دائماً...
          </span>
        </div>

        <div className="relative z-10 space-y-1.5 my-auto py-2">
          <h5 className="text-sm font-black text-white font-cairo leading-snug drop-shadow">
            الانضباط اليوم هو الحرية غداً
          </h5>
          <p className="text-[11px] text-gray-300 leading-relaxed font-cairo">
            كل التزام صغير تقدمه لنفسك اليوم، يبني لك مستقبلاً لا قيود فيه.
          </p>
        </div>

        <div className="relative z-10 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-amber-200/80">
          <span>فكرتو 2.0</span>
          <span>منصة النجاح المتكاملة</span>
        </div>
      </div>
    </div>
  )
}
