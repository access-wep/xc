'use client'

import React, { useState } from 'react'
import type { Task, TaskPriority, TaskStatus, TaskCategory } from '@/types/database'
import {
  Check,
  Clock,
  Plus,
  Trash2,
  Edit2,
  AlertCircle,
  MoreVertical,
  ChevronDown,
  X,
  FileText,
} from 'lucide-react'

interface DailyTaskTableViewProps {
  tasks: Task[]
  categories?: TaskCategory[]
  onToggleTask: (taskId: string, currentCompleted: boolean) => void
  onUpdateStatus: (taskId: string, newStatus: TaskStatus) => void
  onAddTask: (taskData: Partial<Task>) => Promise<void>
  onEditTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
  isReadOnly?: boolean
}

export function DailyTaskTableView({
  tasks,
  categories = [],
  onToggleTask,
  onUpdateStatus,
  onAddTask,
  onEditTask,
  onDeleteTask,
  isReadOnly = false,
}: DailyTaskTableViewProps) {
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false)
  const [quickTitle, setQuickTitle] = useState('')
  const [quickTimeStart, setQuickTimeStart] = useState('')
  const [quickTimeEnd, setQuickTimeEnd] = useState('')
  const [quickPriority, setQuickPriority] = useState<TaskPriority>('medium')
  const [quickCategoryId, setQuickCategoryId] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Status mapping
  const statusConfig: Record<TaskStatus, { label: string; bg: string; text: string; border: string }> = {
    completed: {
      label: 'مكتملة',
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
    },
    in_progress: {
      label: 'قيد التنفيذ',
      bg: 'bg-sky-500/10',
      text: 'text-sky-400',
      border: 'border-sky-500/30',
    },
    not_started: {
      label: 'لم تبدأ',
      bg: 'bg-slate-800',
      text: 'text-slate-400',
      border: 'border-slate-700',
    },
    postponed: {
      label: 'مؤجلة',
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      border: 'border-purple-500/30',
    },
    cancelled: {
      label: 'ملغاة',
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      border: 'border-rose-500/30',
    },
  }

  // Priority mapping
  const priorityConfig: Record<TaskPriority, { label: string; bg: string; text: string }> = {
    urgent: { label: 'عاجلة', bg: 'bg-rose-500/20', text: 'text-rose-400' },
    high: { label: 'عالية', bg: 'bg-red-500/20', text: 'text-red-400' },
    medium: { label: 'متوسطة', bg: 'bg-amber-500/20', text: 'text-amber-400' },
    low: { label: 'منخفضة', bg: 'bg-blue-500/20', text: 'text-blue-400' },
  }

  const handleQuickAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!quickTitle.trim()) return

    setIsSubmitting(true)
    try {
      await onAddTask({
        title: quickTitle.trim(),
        start_time: quickTimeStart || null,
        end_time: quickTimeEnd || null,
        priority: quickPriority,
        category_id: quickCategoryId || null,
        status: 'not_started',
        is_completed: false,
      })
      setQuickTitle('')
      setQuickTimeStart('')
      setQuickTimeEnd('')
      setIsQuickAddOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden text-white">
      {/* 1. Header Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3 bg-slate-950/40">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
          <h3 className="text-base sm:text-lg font-bold text-white">
            مهام اليوم <span className="text-teal-400 font-mono">({tasks.length} مهمة)</span>
          </h3>
        </div>

        {!isReadOnly && (
          <button
            type="button"
            onClick={() => setIsQuickAddOpen(!isQuickAddOpen)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 transition-all cursor-pointer shadow-md shadow-teal-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>إضافة مهمة جديدة</span>
          </button>
        )}
      </div>

      {/* 2. Quick Add Panel (Expandable) */}
      {isQuickAddOpen && (
        <form
          onSubmit={handleQuickAddSubmit}
          className="p-4 bg-slate-950/80 border-b border-slate-800 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
            <input
              type="text"
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              placeholder="اكتب اسم المهمة هنا..."
              className="sm:col-span-5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              autoFocus
              required
            />

            <input
              type="time"
              value={quickTimeStart}
              onChange={(e) => setQuickTimeStart(e.target.value)}
              className="sm:col-span-2 px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-mono"
              title="وقت البداية"
            />

            <input
              type="time"
              value={quickTimeEnd}
              onChange={(e) => setQuickTimeEnd(e.target.value)}
              className="sm:col-span-2 px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-mono"
              title="وقت النهاية"
            />

            <select
              value={quickPriority}
              onChange={(e) => setQuickPriority(e.target.value as TaskPriority)}
              className="sm:col-span-2 px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            >
              <option value="urgent">عاجلة</option>
              <option value="high">عالية</option>
              <option value="medium">متوسطة</option>
              <option value="low">منخفضة</option>
            </select>

            <button
              type="submit"
              disabled={isSubmitting || !quickTitle.trim()}
              className="sm:col-span-1 px-3 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center"
            >
              حفظ
            </button>
          </div>
        </form>
      )}

      {/* 3. Tasks Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-right text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-800/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-950/20">
              <th className="py-3 px-3 w-10 text-center">#</th>
              <th className="py-3 px-3">المهمة</th>
              <th className="py-3 px-3 w-28">الوقت</th>
              <th className="py-3 px-3 w-24">الأولوية</th>
              <th className="py-3 px-3 w-28 text-center">الحالة</th>
              <th className="py-3 px-3 w-12 text-center">إتمام</th>
              {!isReadOnly && <th className="py-3 px-3 w-16 text-center">خيارات</th>}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60">
            {tasks.length > 0 ? (
              tasks.map((task, index) => {
                const isCompleted = task.is_completed || task.status === 'completed'
                const isCancelled = task.status === 'cancelled'
                const statusInfo = statusConfig[task.status] || statusConfig.not_started
                const priorityInfo = priorityConfig[task.priority] || priorityConfig.medium

                return (
                  <tr
                    key={task.id}
                    className={`group transition-colors hover:bg-slate-850/60 ${
                      isCompleted
                        ? 'bg-slate-950/20 text-slate-400'
                        : isCancelled
                        ? 'bg-rose-950/10 text-slate-400 opacity-60'
                        : ''
                    }`}
                  >
                    {/* Index */}
                    <td className="py-3 px-3 text-center font-mono text-slate-500 text-xs">
                      {index + 1}
                    </td>

                    {/* Task Title & Notes */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        {task.color && (
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: task.color }}
                          />
                        )}
                        <span
                          className={`font-semibold transition-all ${
                            isCompleted ? 'line-through text-slate-400' : 'text-slate-100'
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>
                      {task.notes && (
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1 pr-4">
                          {task.notes}
                        </p>
                      )}
                    </td>

                    {/* Time */}
                    <td className="py-3 px-3 font-mono text-xs text-slate-300">
                      {task.start_time ? (
                        <div className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>
                            {task.start_time.slice(0, 5)}
                            {task.end_time ? ` - ${task.end_time.slice(0, 5)}` : ''}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>

                    {/* Priority */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${priorityInfo.bg} ${priorityInfo.text}`}
                      >
                        {priorityInfo.label}
                      </span>
                    </td>

                    {/* Status Select */}
                    <td className="py-3 px-3 text-center">
                      <select
                        value={task.status}
                        onChange={(e) => onUpdateStatus(task.id, e.target.value as TaskStatus)}
                        disabled={isReadOnly}
                        className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none transition-colors cursor-pointer ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
                      >
                        <option value="not_started">لم تبدأ</option>
                        <option value="in_progress">قيد التنفيذ</option>
                        <option value="completed">مكتملة</option>
                        <option value="postponed">مؤجلة</option>
                        <option value="cancelled">ملغاة</option>
                      </select>
                    </td>

                    {/* Instant Checkbox */}
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => onToggleTask(task.id, isCompleted)}
                        disabled={isReadOnly || isCancelled}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center mx-auto transition-all cursor-pointer ${
                          isCompleted
                            ? 'bg-teal-500 text-slate-950 shadow-sm shadow-teal-500/30'
                            : 'border-2 border-slate-700 hover:border-teal-400'
                        }`}
                        title={isCompleted ? 'إلغاء الإكمال' : 'إكمال المهمة'}
                      >
                        {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                      </button>
                    </td>

                    {/* Row Actions */}
                    {!isReadOnly && (
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => onEditTask(task)}
                            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                            title="تعديل المهمة"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteTask(task.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                            title="حذف المهمة"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  <div className="max-w-xs mx-auto space-y-2">
                    <p className="text-sm font-medium text-slate-400">
                      لا توجد مهام مضافة لهذا اليوم حتى الآن.
                    </p>
                    <p className="text-xs text-slate-600">
                      اضغط على زر "إضافة مهمة جديدة" بالأعلى لتنظيم يومك بحرية كاملة.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
