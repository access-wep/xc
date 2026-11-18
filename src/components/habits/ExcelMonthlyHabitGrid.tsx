'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  CalendarDays,
  Check,
  Plus,
  Settings,
  FolderArchive,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Edit2,
  Trash2,
  MoreVertical,
  Minus,
  Layers,
  HelpCircle,
  Lock,
} from 'lucide-react'
import { HabitIconRenderer } from './HabitIconRenderer'
import type { Habit } from '@/types/database'

interface ExcelMonthlyHabitGridProps {
  habits: Habit[]
  habitLogs: Record<string, boolean> // key: `${habitId}_${dateStr}` => isCompleted
  currentDate: Date
  onDateChange: (newDate: Date) => void
  onToggleCell: (habit: Habit, dateStr: string) => void
  onOpenAddModal: () => void
  onOpenEditModal: (habit: Habit) => void
  onOpenDeleteConfirm: (habit: Habit) => void
  onOpenTemplatesModal: () => void
  onOpenSettingsModal: () => void
  onOpenArchiveModal: () => void
  onOpenYearModal: () => void
  isMonthLocked?: boolean
  viewMode: 'original' | 'enhanced'
  onChangeViewMode: (mode: 'original' | 'enhanced') => void
}

export function ExcelMonthlyHabitGrid({
  habits,
  habitLogs,
  currentDate,
  onDateChange,
  onToggleCell,
  onOpenAddModal,
  onOpenEditModal,
  onOpenDeleteConfirm,
  onOpenTemplatesModal,
  onOpenSettingsModal,
  onOpenArchiveModal,
  onOpenYearModal,
  isMonthLocked = false,
  viewMode,
  onChangeViewMode,
}: ExcelMonthlyHabitGridProps) {
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()

  // Number of days in the current selected month
  const daysInMonth = useMemo(() => {
    return new Date(currentYear, currentMonth + 1, 0).getDate()
  }, [currentYear, currentMonth])

  // Array of day numbers: [1, 2, ..., daysInMonth]
  const daysArray = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => i + 1)
  }, [daysInMonth])

  // Current today string in 'YYYY-MM-DD'
  const todayStr = useMemo(() => {
    return new Date().toISOString().split('T')[0]
  }, [])

  // Arabic Month names
  const ARABIC_MONTHS = [
    'يناير',
    'فبراير',
    'مارس',
    'أبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر',
  ]

  // Month navigation helpers
  const handlePrevMonth = () => {
    onDateChange(new Date(currentYear, currentMonth - 1, 1))
  }
  const handleNextMonth = () => {
    onDateChange(new Date(currentYear, currentMonth + 1, 1))
  }

  // Calculate stats per habit
  const habitStats = useMemo(() => {
    const stats: Record<
      string,
      { completedCount: number; targetCount: number; rate: number }
    > = {}

    habits.forEach((habit) => {
      let completedCount = 0
      let targetCount = 0

      const restDays = (habit.rest_days_json as string[]) || []
      const targetDays = (habit.target_days_json as string[]) || [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
      ]

      for (let day = 1; day <= daysInMonth; day++) {
        const dateObj = new Date(currentYear, currentMonth, day)
        const dayOfWeekStr = String(dateObj.getDay())
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

        const isRest = restDays.includes(dayOfWeekStr)
        const isTarget =
          habit.recurrence_type === 'specific_days'
            ? targetDays.includes(dayOfWeekStr)
            : !isRest

        if (isTarget) {
          targetCount++
        }

        const logKey = `${habit.id}_${dateStr}`
        if (habitLogs[logKey]) {
          completedCount++
        }
      }

      const effectiveTarget = targetCount > 0 ? targetCount : daysInMonth
      const rate = Math.round((completedCount / effectiveTarget) * 100)

      stats[habit.id] = {
        completedCount,
        targetCount: effectiveTarget,
        rate: Math.min(100, rate),
      }
    })

    return stats
  }, [habits, habitLogs, currentYear, currentMonth, daysInMonth])

  // Helper to determine if a specific day is a rest day for a habit
  const checkIsRestDay = (habit: Habit, day: number) => {
    const dateObj = new Date(currentYear, currentMonth, day)
    const dayOfWeekStr = String(dateObj.getDay())
    const restDays = (habit.rest_days_json as string[]) || []
    return restDays.includes(dayOfWeekStr)
  }

  return (
    <div className="rounded-3xl bg-slate-950/85 border border-cyan-500/30 backdrop-blur-2xl shadow-[0_12px_48px_rgba(0,0,0,0.8)] overflow-hidden">
      {/* Top Controls Toolbar */}
      <div className="p-4 sm:p-6 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
        {/* Right side in RTL: Title & View Switcher */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white font-cairo flex items-center gap-2">
                <span>متابعة العادات الشهرية</span>
                {isMonthLocked && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center gap-1 font-normal">
                    <Lock className="w-3 h-3" />
                    <span>مغلق</span>
                  </span>
                )}
              </h2>
              <span className="text-[11px] text-gray-400">
                جدول التتبع اليومي على مدار الشهر
              </span>
            </div>
          </div>

          {/* View Switcher: الأصلي / المطور */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-white/10">
            <span className="text-[11px] text-gray-400 px-2 font-bold font-cairo">
              العرض:
            </span>
            <button
              onClick={() => onChangeViewMode('original')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all font-cairo ${
                viewMode === 'original'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(34,211,238,0.5)]'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              الأصلي
            </button>
            <button
              onClick={() => onChangeViewMode('enhanced')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all font-cairo ${
                viewMode === 'enhanced'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(34,211,238,0.5)]'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              المطور
            </button>
          </div>
        </div>

        {/* Left side in RTL: Date Switcher, Add Habit, Tools */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Month Switcher */}
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white">
            <button
              onClick={handlePrevMonth}
              className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="الشهر السابق"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold font-cairo px-2 min-w-[90px] text-center">
              {ARABIC_MONTHS[currentMonth]} {currentYear}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="الشهر التالي"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Full Year Button */}
          <button
            onClick={onOpenYearModal}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-400/40 text-xs font-bold text-gray-300 hover:text-white transition-all font-cairo"
          >
            سنوي
          </button>

          {/* Add Habit Primary CTA */}
          <button
            onClick={onOpenAddModal}
            disabled={isMonthLocked}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 text-xs font-black shadow-[0_0_20px_rgba(34,211,238,0.5)] hover:shadow-[0_0_30px_rgba(34,211,238,0.8)] hover:scale-105 active:scale-95 transition-all font-cairo disabled:opacity-50"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>إضافة عادة</span>
          </button>

          {/* Templates Library Button */}
          <button
            onClick={onOpenTemplatesModal}
            className="p-2 rounded-xl bg-slate-900 border border-white/10 hover:border-purple-400/40 text-purple-300 hover:text-white transition-all shadow-sm"
            title="مكتبة القوالب الجاهزة"
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* General Settings Button */}
          <button
            onClick={onOpenSettingsModal}
            className="p-2 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-400/40 text-gray-300 hover:text-white transition-all shadow-sm"
            title="تخصيص الإعدادات"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Archive / History */}
          <button
            onClick={onOpenArchiveModal}
            className="p-2 rounded-xl bg-slate-900 border border-white/10 hover:border-amber-400/40 text-amber-300 hover:text-white transition-all shadow-sm"
            title="الأرشيف والشهور السابقة"
          >
            <FolderArchive className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* THE EXCEL-STYLE HABIT MATRIX TABLE                                         */}
      {/* ========================================================================= */}
      <div className="overflow-x-auto relative">
        <table className="w-full border-collapse text-right text-xs">
          <thead>
            {/* Super Header: Weeks Grouping (الأسبوع الأول، الثاني، الثالث، الرابع، الخامس) */}
            <tr className="bg-slate-950/90 text-gray-400 text-[11px] font-bold border-b border-white/10">
              <th
                colSpan={2}
                className="p-3 text-right sticky right-0 bg-slate-950 z-20 min-w-[200px] border-l border-white/10 font-cairo"
              >
                تفاصيل العادة ونسبة الإنجاز
              </th>
              {/* Weeks Spans: Days 1-7 (Week 1), 8-14 (Week 2), 15-21 (Week 3), 22-28 (Week 4), 29-31 (Week 5) */}
              <th colSpan={7} className="p-2 text-center border-l border-white/10 bg-cyan-950/20 text-cyan-300 font-cairo">
                الأسبوع الأول
              </th>
              <th colSpan={7} className="p-2 text-center border-l border-white/10 bg-indigo-950/20 text-indigo-300 font-cairo">
                الأسبوع الثاني
              </th>
              <th colSpan={7} className="p-2 text-center border-l border-white/10 bg-purple-950/20 text-purple-300 font-cairo">
                الأسبوع الثالث
              </th>
              <th colSpan={7} className="p-2 text-center border-l border-white/10 bg-pink-950/20 text-pink-300 font-cairo">
                الأسبوع الرابع
              </th>
              {daysInMonth > 28 && (
                <th colSpan={daysInMonth - 28} className="p-2 text-center border-l border-white/10 bg-emerald-950/20 text-emerald-300 font-cairo">
                  الأسبوع الخامس
                </th>
              )}
              <th className="p-2 text-center min-w-[70px] font-cairo">إجراءات</th>
            </tr>

            {/* Sub-Header: Day Numbers (1, 2, 3, ... 31) */}
            <tr className="bg-slate-900/90 text-gray-300 font-mono text-[11px] border-b border-white/10">
              <th className="p-2.5 text-right sticky right-0 bg-slate-900 z-20 min-w-[140px] font-cairo font-bold">
                اسم العادة
              </th>
              <th className="p-2.5 text-center sticky right-[140px] bg-slate-900 z-20 min-w-[80px] border-l border-white/10 font-cairo font-bold">
                المجموع %
              </th>

              {daysArray.map((day) => {
                const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                const isToday = dateStr === todayStr

                return (
                  <th
                    key={day}
                    className={`p-2 text-center min-w-[32px] max-w-[36px] font-bold border-l border-white/5 transition-colors ${
                      isToday
                        ? 'bg-cyan-500/20 text-cyan-300 font-black shadow-inner border-cyan-400/40'
                        : 'text-gray-300'
                    }`}
                  >
                    <span className={isToday ? 'px-1.5 py-0.5 rounded-full bg-cyan-500 text-slate-950 text-[10px]' : ''}>
                      {day}
                    </span>
                  </th>
                )
              })}

              <th className="p-2 text-center text-gray-400 font-cairo">إدارة</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5 font-sans">
            {habits.length === 0 ? (
              <tr>
                <td
                  colSpan={daysInMonth + 3}
                  className="py-12 text-center text-gray-400 space-y-3"
                >
                  <CalendarDays className="w-10 h-10 mx-auto text-gray-600 mb-2" />
                  <p className="text-sm font-bold text-gray-300 font-cairo">
                    لا توجد عادات مضافة لهذا الشهر حتى الآن
                  </p>
                  <p className="text-xs text-gray-500 font-cairo">
                    ابدأ بإضافة عادة جديدة أو اختر حزمة جاهزة من مكتبة القوالب!
                  </p>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={onOpenAddModal}
                      className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs font-cairo hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20"
                    >
                      + إضافة أول عادة
                    </button>
                    <button
                      onClick={onOpenTemplatesModal}
                      className="px-4 py-2 rounded-xl bg-purple-900/50 border border-purple-500/40 text-purple-300 font-bold text-xs font-cairo hover:bg-purple-900 transition-colors"
                    >
                      استعراض القوالب الجاهزة
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              habits.map((habit, habitIndex) => {
                const stats = habitStats[habit.id] || {
                  completedCount: 0,
                  targetCount: daysInMonth,
                  rate: 0,
                }

                return (
                  <tr
                    key={habit.id}
                    className="hover:bg-slate-900/60 transition-colors group"
                  >
                    {/* Sticky Column 1: Habit Icon & Name */}
                    <td className="p-3 sticky right-0 bg-slate-950 group-hover:bg-slate-900 z-10 border-l border-white/5 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-white flex-shrink-0 shadow-sm"
                          style={{
                            backgroundColor: habit.color || '#10b981',
                            boxShadow: `0 0 10px ${habit.color || '#10b981'}40`,
                          }}
                        >
                          <HabitIconRenderer name={habit.icon} className="w-3.5 h-3.5" />
                        </div>
                        <div className="truncate max-w-[130px]">
                          <span className="font-bold text-white text-xs block truncate font-cairo">
                            {habit.name}
                          </span>
                          {habit.description && (
                            <span className="text-[10px] text-gray-400 block truncate">
                              {habit.description}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Sticky Column 2: Ratio & Percentage (e.g. 31/31 100%) */}
                    <td className="p-2 text-center sticky right-[140px] bg-slate-950 group-hover:bg-slate-900 z-10 border-l border-white/10 font-mono text-[11px] transition-colors">
                      <div className="flex flex-col items-center">
                        <span className="text-gray-300 font-bold text-[10px]">
                          {stats.completedCount}/{stats.targetCount}
                        </span>
                        <span
                          className={`font-black text-xs font-cairo ${
                            stats.rate >= 80
                              ? 'text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.5)]'
                              : stats.rate >= 50
                              ? 'text-cyan-300'
                              : 'text-amber-400'
                          }`}
                        >
                          {stats.rate}%
                        </span>
                      </div>
                    </td>

                    {/* Checkbox Columns for Days 1 through daysInMonth */}
                    {daysArray.map((day) => {
                      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                      const isToday = dateStr === todayStr
                      const logKey = `${habit.id}_${dateStr}`
                      const isCompleted = !!habitLogs[logKey]
                      const isRestDay = checkIsRestDay(habit, day)

                      return (
                        <td
                          key={day}
                          onClick={() => {
                            if (!isMonthLocked) {
                              onToggleCell(habit, dateStr)
                            }
                          }}
                          className={`p-1 text-center border-l border-white/5 transition-all select-none ${
                            isToday ? 'bg-cyan-500/10' : ''
                          } ${
                            isMonthLocked
                              ? 'cursor-not-allowed opacity-75'
                              : 'cursor-pointer hover:bg-slate-800/80'
                          }`}
                        >
                          <div className="flex items-center justify-center">
                            {isRestDay && !isCompleted ? (
                              <div
                                className="w-5 h-5 rounded-md border border-white/10 bg-slate-900/60 flex items-center justify-center text-gray-500 hover:text-gray-300 transition-colors"
                                title="يوم راحة محدد"
                              >
                                <Minus className="w-2.5 h-2.5 stroke-[3]" />
                              </div>
                            ) : (
                              <div
                                className={`w-5 h-5 rounded-md border transition-all flex items-center justify-center ${
                                  isCompleted
                                    ? 'bg-gradient-to-tr from-cyan-500 to-teal-400 border-cyan-400 text-slate-950 shadow-[0_0_10px_rgba(34,211,238,0.7)] scale-105'
                                    : 'border-white/15 bg-slate-900/80 hover:border-cyan-400/50 hover:bg-slate-800'
                                }`}
                              >
                                {isCompleted && (
                                  <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      )
                    })}

                    {/* Actions Column (Edit, Delete, Archive) */}
                    <td className="p-2 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onOpenEditModal(habit)}
                          className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-cyan-300 transition-colors"
                          title="تعديل العادة"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenDeleteConfirm(habit)}
                          className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors"
                          title="حذف العادة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
