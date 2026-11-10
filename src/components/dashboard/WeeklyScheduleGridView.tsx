'use client'

import React from 'react'
import type { Task, ScheduleDay } from '@/types/database'
import { calculateDayCompletion } from '@/lib/productivity'
import { Check, Plus, Clock } from 'lucide-react'

interface WeeklyScheduleGridViewProps {
  days: ScheduleDay[]
  tasksByDayId: Record<string, Task[]>
  selectedDateStr: string
  onSelectDay: (day: ScheduleDay) => void
  onToggleTask: (taskId: string, currentCompleted: boolean) => void
  onAddTaskToDay: (dayId: string) => void
  isReadOnly?: boolean
}

export function WeeklyScheduleGridView({
  days,
  tasksByDayId,
  selectedDateStr,
  onSelectDay,
  onToggleTask,
  onAddTaskToDay,
  isReadOnly = false,
}: WeeklyScheduleGridViewProps) {
  return (
    <div className="overflow-x-auto pb-4">
      <div className="min-w-[950px] grid grid-cols-7 gap-3">
        {days.map((day) => {
          const dayTasks = tasksByDayId[day.id] || []
          const stats = calculateDayCompletion(dayTasks)
          const isSelected = day.date === selectedDateStr
          const dayDate = new Date(day.date)
          const dayNumber = dayDate.getDate()
          const dayNameArabic = new Intl.DateTimeFormat('ar-SA', { weekday: 'short' }).format(dayDate)

          return (
            <div
              key={day.id}
              className={`flex flex-col rounded-2xl border transition-all duration-200 ${
                isSelected
                  ? 'bg-slate-900 border-teal-500/80 shadow-lg shadow-teal-500/10 ring-1 ring-teal-500/50'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Day Header */}
              <div
                onClick={() => onSelectDay(day)}
                className="p-3 border-b border-slate-800 cursor-pointer select-none bg-slate-950/40 rounded-t-2xl flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{dayNameArabic}</span>
                    <span className="text-teal-400 font-mono text-sm">{dayNumber}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {stats.completed}/{stats.required} مكتملة
                  </div>
                </div>

                {/* Day Mini Circular Progress */}
                <div className="w-9 h-9 relative flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 -rotate-90">
                    <circle
                      cx="16"
                      cy="16"
                      r="12"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="text-slate-800"
                      fill="transparent"
                    />
                    <circle
                      cx="16"
                      cy="16"
                      r="12"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className={`${
                        stats.is100Percent ? 'text-emerald-400' : 'text-teal-400'
                      } transition-all duration-500`}
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 12}
                      strokeDashoffset={
                        2 * Math.PI * 12 - (stats.rate / 100) * (2 * Math.PI * 12)
                      }
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-[9px] font-bold text-white">
                    {stats.rate}%
                  </span>
                </div>
              </div>

              {/* Tasks List */}
              <div className="p-2 space-y-2 flex-1 min-h-[260px] max-h-[450px] overflow-y-auto">
                {dayTasks.length > 0 ? (
                  dayTasks.map((task) => {
                    const isCompleted = task.is_completed || task.status === 'completed'
                    const isCancelled = task.status === 'cancelled'

                    return (
                      <div
                        key={task.id}
                        className={`p-2.5 rounded-xl border text-xs transition-all ${
                          isCompleted
                            ? 'bg-slate-950/40 border-slate-800/80 text-slate-500'
                            : isCancelled
                            ? 'bg-rose-950/20 border-rose-900/30 text-slate-400 opacity-60'
                            : 'bg-slate-850 hover:bg-slate-800 border-slate-750 text-white shadow-sm'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              onToggleTask(task.id, isCompleted)
                            }}
                            disabled={isReadOnly || isCancelled}
                            className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer ${
                              isCompleted
                                ? 'bg-teal-500 text-slate-950'
                                : 'border border-slate-600 hover:border-teal-400'
                            }`}
                          >
                            {isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                          </button>

                          <div className="flex-1 min-w-0">
                            <div
                              className={`font-medium line-clamp-2 leading-snug ${
                                isCompleted ? 'line-through text-slate-400' : 'text-slate-100'
                              }`}
                            >
                              {task.title}
                            </div>

                            {task.start_time && (
                              <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono mt-1.5">
                                <Clock className="w-2.5 h-2.5 text-slate-400" />
                                <span>{task.start_time.slice(0, 5)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-3 text-slate-600">
                    <span className="text-[11px]">لا توجد مهام</span>
                  </div>
                )}
              </div>

              {/* Quick Add Button */}
              {!isReadOnly && (
                <div className="p-2 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => onAddTaskToDay(day.id)}
                    className="w-full py-1.5 rounded-xl text-[11px] font-semibold text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>مهمة</span>
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
