'use client'

import React from 'react'
import { Modal, Button } from '@/components/ui'
import {
  FolderArchive,
  Lock,
  Unlock,
  Calendar,
  CheckCircle2,
  TrendingUp,
  RefreshCw,
  Archive,
  RotateCcw,
} from 'lucide-react'
import type { Habit } from '@/types/database'

interface HabitArchiveModalProps {
  isOpen: boolean
  onClose: () => void
  currentDate: Date
  onSelectMonth: (year: number, month: number) => void
  isCurrentMonthLocked: boolean
  onToggleLockMonth: () => void
  archivedHabits: Habit[]
  onRestoreHabit: (habit: Habit) => Promise<void>
}

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

export function HabitArchiveModal({
  isOpen,
  onClose,
  currentDate,
  onSelectMonth,
  isCurrentMonthLocked,
  onToggleLockMonth,
  archivedHabits,
  onRestoreHabit,
}: HabitArchiveModalProps) {
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()

  // Full Year 12 Months Matrix
  const yearMonths = Array.from({ length: 12 }, (_, i) => ({
    index: i,
    name: ARABIC_MONTHS[i],
    isCurrent: i === currentMonth,
  }))

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="أرشيف الشهور والعادات السابقة"
      size="lg"
    >
      <div className="space-y-6 text-right font-cairo">
        {/* Month Lock Control Banner */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-right">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              {isCurrentMonthLocked ? (
                <Lock className="w-4 h-4 text-amber-400" />
              ) : (
                <Unlock className="w-4 h-4 text-emerald-400" />
              )}
              <span>
                حالة شهر {ARABIC_MONTHS[currentMonth]} {currentYear}:{' '}
                {isCurrentMonthLocked ? 'مغلق (محمي من التعديل)' : 'مفتوح وقابل للتعديل'}
              </span>
            </h4>
            <p className="text-[11px] text-gray-400 mt-1">
              إغلاق الشهر يحمي إنجازاتك التاريخية من التغيير العفوي، ويمكنك إعادة فتحه في أي وقت.
            </p>
          </div>

          <Button
            type="button"
            size="sm"
            onClick={onToggleLockMonth}
            className={`text-xs font-bold font-cairo flex-shrink-0 ${
              isCurrentMonthLocked
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
            }`}
          >
            {isCurrentMonthLocked ? 'إعادة فتح الشهر للتعديل' : 'إغلاق الشهر وتأكيده'}
          </Button>
        </div>

        {/* 12 Months Fast Navigation Matrix */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">انقر للانتقال المباشر</span>
            <h5 className="text-xs font-bold text-gray-300">
              شهور سنة {currentYear}
            </h5>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
            {yearMonths.map((m) => (
              <button
                key={m.index}
                onClick={() => {
                  onSelectMonth(currentYear, m.index)
                  onClose()
                }}
                className={`p-3 rounded-xl border text-center transition-all ${
                  m.isCurrent
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-black shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                    : 'bg-slate-900/60 border-white/5 text-gray-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span className="text-xs font-bold block">{m.name}</span>
                <span className="text-[10px] text-gray-500 block mt-0.5">
                  {currentYear}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Archived Habits Section */}
        <div className="space-y-3 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {archivedHabits.length} عادات في الأرشيف
            </span>
            <h5 className="text-xs font-bold text-gray-300 flex items-center gap-2">
              <Archive className="w-4 h-4 text-amber-400" />
              <span>العادات المؤرشفة</span>
            </h5>
          </div>

          {archivedHabits.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-4 bg-slate-900/40 rounded-xl border border-white/5">
              لا توجد عادات مؤرشفة حالياً.
            </p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto p-1">
              {archivedHabits.map((habit) => (
                <div
                  key={habit.id}
                  className="p-3 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between"
                >
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onRestoreHabit(habit)}
                    className="text-xs font-bold text-cyan-400 hover:bg-cyan-500/10 border-cyan-500/30"
                  >
                    <RotateCcw className="w-3.5 h-3.5 ml-1.5" />
                    <span>استعادة للجدول</span>
                  </Button>

                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold text-white">{habit.name}</span>
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: habit.color || '#10b981' }}
                    >
                      ✓
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-white/10">
          <Button variant="outline" onClick={onClose}>
            إغلاق
          </Button>
        </div>
      </div>
    </Modal>
  )
}
