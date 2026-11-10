'use client'

import React, { useState } from 'react'
import type { Habit, HabitLog } from '@/types/database'
import { Plus, Check, Trash2, Edit2, Sparkles, Flame, Target } from 'lucide-react'

interface MonthlyHabitsTrackerViewProps {
  habits: Habit[]
  habitLogs: Record<string, boolean> // key: `${habitId}_${dateStr}`
  currentDate: Date
  onToggleHabitDate: (habitId: string, dateStr: string) => Promise<void>
  onAddHabit: (habitData: Partial<Habit>) => Promise<void>
  onDeleteHabit: (habitId: string) => Promise<void>
  isReadOnly?: boolean
}

export function MonthlyHabitsTrackerView({
  habits,
  habitLogs,
  currentDate,
  onToggleHabitDate,
  onAddHabit,
  onDeleteHabit,
  isReadOnly = false,
}: MonthlyHabitsTrackerViewProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [habitName, setHabitName] = useState('')
  const [habitColor, setHabitColor] = useState('#10b981')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const monthNameArabic = new Intl.DateTimeFormat('ar-SA', { month: 'long', year: 'numeric' }).format(currentDate)
  const todayStr = new Date().toISOString().split('T')[0]

  // Color options for habit
  const colorOptions = ['#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#f97316']

  const handleCreateHabit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!habitName.trim()) return

    setIsSubmitting(true)
    try {
      await onAddHabit({
        name: habitName.trim(),
        color: habitColor,
        target_days_per_week: 7,
      })
      setHabitName('')
      setIsAddModalOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calculate habit stats for month
  const getHabitStats = (habitId: string) => {
    let completedCount = 0
    let daysPassed = 0

    for (let day = 1; day <= daysInMonth; day++) {
      const dObj = new Date(currentYear, currentMonth, day)
      const dStr = dObj.toISOString().split('T')[0]
      if (dStr <= todayStr) daysPassed++
      if (habitLogs[`${habitId}_${dStr}`]) {
        completedCount++
      }
    }

    const rate = daysPassed > 0 ? Math.round((completedCount / daysPassed) * 100) : 0
    return { completedCount, rate }
  }

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden text-white">
      {/* 1. Header Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3 bg-slate-950/40">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              متابعة العادات الشهرية – <span className="text-emerald-400">{monthNameArabic}</span>
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            تتبع التزامك اليومي بعاداتك لبناء نمط حياة منظم ومستقر
          </p>
        </div>

        {!isReadOnly && (
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all cursor-pointer shadow-md shadow-emerald-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>إضافة عادة جديدة</span>
          </button>
        )}
      </div>

      {/* 2. Habit Grid Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 bg-slate-950/30">
              <th className="py-3 px-4 text-right w-52">اسم العادة</th>
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((dayNum) => {
                const dObj = new Date(currentYear, currentMonth, dayNum)
                const dStr = dObj.toISOString().split('T')[0]
                const isToday = dStr === todayStr
                const isWeekend = dObj.getDay() === 5 || dObj.getDay() === 6 // Fri or Sat in Arab world

                return (
                  <th
                    key={dayNum}
                    className={`py-2 px-1 w-7 text-center font-mono ${
                      isToday
                        ? 'bg-emerald-950/40 text-emerald-400 font-bold border-b-2 border-emerald-500'
                        : isWeekend
                        ? 'text-slate-500 bg-slate-950/20'
                        : ''
                    }`}
                  >
                    <div>{dayNum}</div>
                  </th>
                )
              })}
              <th className="py-3 px-3 w-20 text-center">الإنجاز</th>
              <th className="py-3 px-3 w-24 text-center">الالتزام</th>
              {!isReadOnly && <th className="py-3 px-2 w-12 text-center">إجراء</th>}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60">
            {habits.length > 0 ? (
              habits.map((habit) => {
                const { completedCount, rate } = getHabitStats(habit.id)

                return (
                  <tr key={habit.id} className="hover:bg-slate-850/40 transition-colors">
                    {/* Habit Name Column */}
                    <td className="py-3 px-4 text-right font-medium text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: habit.color || '#10b981' }}
                        />
                        <span className="text-slate-100">{habit.name}</span>
                      </div>
                    </td>

                    {/* Days Checkboxes */}
                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((dayNum) => {
                      const dObj = new Date(currentYear, currentMonth, dayNum)
                      const dStr = dObj.toISOString().split('T')[0]
                      const isCompleted = !!habitLogs[`${habit.id}_${dStr}`]
                      const isFuture = dStr > todayStr
                      const isToday = dStr === todayStr

                      return (
                        <td
                          key={dayNum}
                          className={`py-2 px-0.5 text-center ${
                            isToday ? 'bg-emerald-950/20' : ''
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => onToggleHabitDate(habit.id, dStr)}
                            disabled={isReadOnly}
                            className={`w-5 h-5 rounded-md mx-auto flex items-center justify-center transition-all cursor-pointer ${
                              isCompleted
                                ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/20'
                                : isFuture
                                ? 'border border-slate-800 opacity-40 hover:opacity-80'
                                : 'border border-slate-700 hover:border-emerald-500'
                            }`}
                            title={`${habit.name} - يوم ${dayNum}`}
                          >
                            {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </button>
                        </td>
                      )
                    })}

                    {/* Completed Count */}
                    <td className="py-3 px-3 text-center font-mono font-bold text-xs text-white">
                      {completedCount} <span className="text-slate-500 font-normal">/ {daysInMonth}</span>
                    </td>

                    {/* Commitment Progress Bar */}
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center gap-1.5 justify-center">
                        <div className="w-12 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                            style={{ width: `${rate}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400 font-mono w-7">
                          {rate}%
                        </span>
                      </div>
                    </td>

                    {/* Delete action */}
                    {!isReadOnly && (
                      <td className="py-3 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => onDeleteHabit(habit.id)}
                          className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                          title="حذف العادة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={daysInMonth + 4} className="py-12 text-center text-slate-500">
                  <div className="max-w-xs mx-auto space-y-2">
                    <p className="text-sm font-medium text-slate-400">
                      لم تضف أي عادات شهرية بعد.
                    </p>
                    <p className="text-xs text-slate-600">
                      ابدأ بإضافة عاداتك الخاصة (مثل ورد القرآن، الرياضة، القراءة) لمتابعة التزامك اليومي.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 3. Add Habit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-white">
            <h4 className="text-base font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>إضافة عادة شهرية جديدة</span>
            </h4>

            <form onSubmit={handleCreateHabit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                  اسم العادة
                </label>
                <input
                  type="text"
                  value={habitName}
                  onChange={(e) => setHabitName(e.target.value)}
                  placeholder="مثال: قراءة 20 صفحة، رياضة 30 دقيقة..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                  لون تمييز العادة
                </label>
                <div className="flex items-center gap-2">
                  {colorOptions.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setHabitColor(c)}
                      className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${
                        habitColor === c ? 'scale-125 ring-2 ring-white' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !habitName.trim()}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
                >
                  حفظ العادة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
