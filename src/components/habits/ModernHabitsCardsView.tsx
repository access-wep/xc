'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  Flame,
  CheckCircle2,
  Calendar,
  Sparkles,
  Edit2,
  Trash2,
  Plus,
  Check,
  Target,
  ArrowUpRight,
} from 'lucide-react'
import { HabitIconRenderer } from './HabitIconRenderer'
import type { Habit } from '@/types/database'

interface ModernHabitsCardsViewProps {
  habits: Habit[]
  habitLogs: Record<string, boolean>
  currentDate: Date
  onToggleToday: (habit: Habit) => void
  onOpenEditModal: (habit: Habit) => void
  onOpenDeleteConfirm: (habit: Habit) => void
  onOpenAddModal: () => void
  todayStr: string
}

export function ModernHabitsCardsView({
  habits,
  habitLogs,
  currentDate,
  onToggleToday,
  onOpenEditModal,
  onOpenDeleteConfirm,
  onOpenAddModal,
  todayStr,
}: ModernHabitsCardsViewProps) {
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  // Last 7 days dates for mini sparkline dots
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })

  return (
    <div className="space-y-6">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {habits.map((habit) => {
          // Calculate completions in current month
          let monthCompletedCount = 0
          for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            if (habitLogs[`${habit.id}_${dateStr}`]) {
              monthCompletedCount++
            }
          }

          const targetCount = habit.monthly_target || daysInMonth
          const rate = Math.min(100, Math.round((monthCompletedCount / targetCount) * 100))
          const isTodayCompleted = !!habitLogs[`${habit.id}_${todayStr}`]

          return (
            <motion.div
              key={habit.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="p-5 rounded-3xl bg-slate-950/80 border border-white/10 hover:border-cyan-400/40 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex flex-col justify-between space-y-4 text-right group relative overflow-hidden"
            >
              {/* Top Accent Light Bar */}
              <div
                className="absolute top-0 inset-x-0 h-1"
                style={{
                  backgroundColor: habit.color || '#22d3ee',
                  boxShadow: `0 0 12px ${habit.color || '#22d3ee'}`,
                }}
              />

              {/* Card Header: Icon + Title + Actions */}
              <div className="flex items-start justify-between gap-3 pt-1">
                <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onOpenEditModal(habit)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-cyan-300 transition-colors"
                    title="تعديل"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onOpenDeleteConfirm(habit)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors"
                    title="حذف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div>
                    <h4 className="text-base font-black text-white font-cairo block">
                      {habit.name}
                    </h4>
                    <span className="text-[11px] text-gray-400 block mt-0.5">
                      {habit.description || `${habit.target_days_per_week || 7} أيام أسبوعياً`}
                    </span>
                  </div>

                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md flex-shrink-0"
                    style={{
                      backgroundColor: habit.color || '#10b981',
                      boxShadow: `0 0 15px ${habit.color || '#10b981'}40`,
                    }}
                  >
                    <HabitIconRenderer name={habit.icon} className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              {/* Monthly Rate & Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400 font-mono text-[11px]">
                    {monthCompletedCount} / {targetCount} يوم
                  </span>
                  <span
                    className="font-black text-xs font-cairo"
                    style={{ color: habit.color || '#22d3ee' }}
                  >
                    {rate}% هذا الشهر
                  </span>
                </div>

                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${rate}%`,
                      backgroundColor: habit.color || '#22d3ee',
                      boxShadow: `0 0 8px ${habit.color || '#22d3ee'}`,
                    }}
                  />
                </div>
              </div>

              {/* Recent 7 Days Mini Dot Strip */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {last7Days.map((dStr, idx) => {
                    const done = !!habitLogs[`${habit.id}_${dStr}`]
                    const isToday = dStr === todayStr
                    return (
                      <div
                        key={idx}
                        className={`w-3.5 h-3.5 rounded-md flex items-center justify-center transition-all ${
                          done
                            ? 'bg-cyan-400 text-slate-950 shadow-[0_0_6px_rgba(34,211,238,0.6)]'
                            : 'bg-slate-900 border border-white/10'
                        } ${isToday ? 'ring-1 ring-cyan-400' : ''}`}
                        title={dStr}
                      >
                        {done && <Check className="w-2 h-2 stroke-[3]" />}
                      </div>
                    )
                  })}
                </div>
                <span className="text-[10px] text-gray-500">آخر 7 أيام</span>
              </div>

              {/* Quick Toggle for Today Button */}
              <button
                onClick={() => onToggleToday(habit)}
                className={`w-full py-2.5 px-4 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 font-cairo ${
                  isTodayCompleted
                    ? 'bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : 'bg-slate-900 border border-white/10 hover:border-cyan-400/40 text-gray-300 hover:text-white'
                }`}
              >
                {isTodayCompleted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>تم إنجاز عادة اليوم بنجاح ✓</span>
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4 text-cyan-400" />
                    <span>تسجيل إنجاز اليوم</span>
                  </>
                )}
              </button>
            </motion.div>
          )
        })}

        {/* Empty State / Add Card */}
        <button
          onClick={onOpenAddModal}
          className="p-8 rounded-3xl border-2 border-dashed border-white/10 hover:border-cyan-400/40 bg-slate-950/40 hover:bg-slate-900/60 transition-all flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-cyan-300 group min-h-[220px]"
        >
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform text-cyan-400">
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-sm font-bold font-cairo">إضافة عادة جديدة الآن</span>
        </button>
      </div>
    </div>
  )
}
