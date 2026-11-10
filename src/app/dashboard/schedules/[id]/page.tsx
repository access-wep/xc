'use client'

export const runtime = 'edge'

import React, { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { ViewSwitcher, type ViewMode } from '@/components/dashboard/ViewSwitcher'
import { KPIStatsBar } from '@/components/dashboard/KPIStatsBar'
import { DailyTaskTableView } from '@/components/dashboard/DailyTaskTableView'
import { WeeklyScheduleGridView } from '@/components/dashboard/WeeklyScheduleGridView'
import { MonthlyHabitsTrackerView } from '@/components/dashboard/MonthlyHabitsTrackerView'
import { calculateDayCompletion, calculateStreakStats } from '@/lib/productivity'
import { Modal, Input, Textarea, Select, Button, Badge } from '@/components/ui'
import {
  CalendarDays,
  ArrowRight,
  Clock,
  Sparkles,
  BarChart3,
  Calendar,
  Layers,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react'
import type {
  Schedule,
  ScheduleDay,
  Task,
  TaskPriority,
  TaskStatus,
  TaskCategory,
  Habit,
  HabitLog,
} from '@/types/database'

export default function ScheduleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const scheduleId = params.id as string
  const { user } = useAuth()
  const supabase = createClient()

  // Primary State
  const [schedule, setSchedule] = useState<Schedule | null>(null)
  const [days, setDays] = useState<ScheduleDay[]>([])
  const [selectedDayId, setSelectedDayId] = useState<string>('')
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [viewMode, setViewMode] = useState<ViewMode>('daily')
  const [tasks, setTasks] = useState<Task[]>([])
  const [categories, setCategories] = useState<TaskCategory[]>([])
  const [habits, setHabits] = useState<Habit[]>([])
  const [habitLogs, setHabitLogs] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(true)

  // Edit / Add Task Modal
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [taskModalDayId, setTaskModalDayId] = useState<string>('')
  const [modalTitle, setModalTitle] = useState('')
  const [modalDescription, setModalDescription] = useState('')
  const [modalStartTime, setModalStartTime] = useState('')
  const [modalEndTime, setModalEndTime] = useState('')
  const [modalPriority, setModalPriority] = useState<TaskPriority>('medium')
  const [modalStatus, setModalStatus] = useState<TaskStatus>('not_started')
  const [modalNotes, setModalNotes] = useState('')
  const [modalColor, setModalColor] = useState('#10b981')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 1. Fetch Schedule, Days, and ALL Tasks for this schedule
  const loadScheduleData = async () => {
    if (!user || !scheduleId) return
    setIsLoading(true)

    try {
      // 1. Schedule info
      const { data: sData, error: sErr } = await supabase
        .from('schedules')
        .select('*')
        .eq('id', scheduleId)
        .eq('user_id', user.id)
        .single()

      if (sErr) throw sErr
      setSchedule(sData)

      // 2. Schedule days
      const { data: dData, error: dErr } = await supabase
        .from('schedule_days')
        .select('*')
        .eq('schedule_id', scheduleId)
        .order('date', { ascending: true })

      if (dErr) throw dErr
      const scheduleDays: ScheduleDay[] = dData || []
      setDays(scheduleDays)

      // Pick selected day
      const todayStr = new Date().toISOString().split('T')[0]
      const matchingDay = scheduleDays.find((d) => d.date === todayStr)
      if (matchingDay) {
        setSelectedDayId(matchingDay.id)
        setCurrentDate(new Date(matchingDay.date))
      } else if (scheduleDays.length > 0) {
        setSelectedDayId(scheduleDays[0].id)
        setCurrentDate(new Date(scheduleDays[0].date))
      }

      // 3. Fetch ALL tasks for this schedule
      const { data: tData, error: tErr } = await supabase
        .from('tasks')
        .select('*')
        .eq('schedule_id', scheduleId)
        .order('sort_order', { ascending: true })

      if (tErr) throw tErr
      setTasks(tData || [])

      // 4. Fetch categories
      const { data: catData } = await supabase
        .from('task_categories')
        .select('*')
        .eq('user_id', user.id)
      setCategories(catData || [])

      // 5. Fetch habits & habit logs
      const { data: hData } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
      setHabits(hData || [])

      const { data: hlData } = await supabase
        .from('habit_logs')
        .select('*')
        .eq('user_id', user.id)

      const logsMap: Record<string, boolean> = {}
      ;(hlData || []).forEach((l: HabitLog) => {
        if (l.is_completed) logsMap[`${l.habit_id}_${l.date}`] = true
      })
      setHabitLogs(logsMap)
    } catch (err) {
      console.error('Error loading schedule workspace:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadScheduleData()
  }, [user, scheduleId])

  // Map tasks by day ID
  const tasksByDayId = useMemo(() => {
    const map: Record<string, Task[]> = {}
    tasks.forEach((t) => {
      if (!map[t.schedule_day_id]) map[t.schedule_day_id] = []
      map[t.schedule_day_id].push(t)
    })
    return map
  }, [tasks])

  // Selected Day and its tasks
  const selectedDay = useMemo(() => {
    return days.find((d) => d.id === selectedDayId) || days[0] || null
  }, [days, selectedDayId])

  const selectedDayTasks = useMemo(() => {
    if (!selectedDay) return []
    return tasksByDayId[selectedDay.id] || []
  }, [selectedDay, tasksByDayId])

  // Compute KPI Stats for selected day
  const dayStats = useMemo(() => {
    return calculateDayCompletion(selectedDayTasks)
  }, [selectedDayTasks])

  // Compute Streaks for this schedule
  const streakStats = useMemo(() => {
    const daysWithTasks = days.map((d) => ({
      ...d,
      tasks: tasksByDayId[d.id] || [],
    }))
    return calculateStreakStats(daysWithTasks, currentDate)
  }, [days, tasksByDayId, currentDate])

  // Synchronize current date changes with selected day
  const handleDateChange = (newDate: Date) => {
    setCurrentDate(newDate)
    const dStr = newDate.toISOString().split('T')[0]
    const matching = days.find((d) => d.date === dStr)
    if (matching) {
      setSelectedDayId(matching.id)
    }
  }

  const handleSelectDay = (day: ScheduleDay) => {
    setSelectedDayId(day.id)
    setCurrentDate(new Date(day.date))
  }

  // 2. Task Actions
  const handleToggleTask = async (taskId: string, currentCompleted: boolean) => {
    const newCompleted = !currentCompleted
    const newStatus: TaskStatus = newCompleted ? 'completed' : 'not_started'

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, is_completed: newCompleted, status: newStatus } : t
      )
    )

    try {
      await supabase
        .from('tasks')
        .update({ is_completed: newCompleted, status: newStatus })
        .eq('id', taskId)
    } catch (err) {
      console.error('Error toggling task:', err)
      loadScheduleData()
    }
  }

  const handleUpdateStatus = async (taskId: string, newStatus: TaskStatus) => {
    const isCompleted = newStatus === 'completed'

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: newStatus, is_completed: isCompleted } : t
      )
    )

    try {
      await supabase
        .from('tasks')
        .update({ status: newStatus, is_completed: isCompleted })
        .eq('id', taskId)
    } catch (err) {
      console.error('Error updating status:', err)
      loadScheduleData()
    }
  }

  const handleQuickAddTask = async (taskData: Partial<Task>) => {
    if (!user || !selectedDay) return

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          schedule_day_id: selectedDay.id,
          schedule_id: scheduleId,
          user_id: user.id,
          title: taskData.title,
          start_time: taskData.start_time,
          end_time: taskData.end_time,
          priority: taskData.priority || 'medium',
          status: 'not_started',
          is_completed: false,
          color: taskData.color || '#10b981',
          sort_order: selectedDayTasks.length,
        })
        .select()
        .single()

      if (error) throw error
      if (data) {
        setTasks((prev) => [...prev, data])
      }
    } catch (err) {
      console.error('Error adding task:', err)
    }
  }

  const handleOpenModalForDay = (dayId: string) => {
    setTaskModalDayId(dayId)
    setEditingTask(null)
    setModalTitle('')
    setModalDescription('')
    setModalStartTime('')
    setModalEndTime('')
    setModalPriority('medium')
    setModalStatus('not_started')
    setModalNotes('')
    setModalColor('#10b981')
    setIsTaskModalOpen(true)
  }

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task)
    setTaskModalDayId(task.schedule_day_id)
    setModalTitle(task.title)
    setModalDescription(task.description || '')
    setModalStartTime(task.start_time || '')
    setModalEndTime(task.end_time || '')
    setModalPriority(task.priority)
    setModalStatus(task.status)
    setModalNotes(task.notes || '')
    setModalColor(task.color || '#10b981')
    setIsTaskModalOpen(true)
  }

  const handleSaveModalTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !modalTitle.trim()) return

    setIsSubmitting(true)
    const isCompleted = modalStatus === 'completed'

    try {
      if (editingTask) {
        const { data, error } = await supabase
          .from('tasks')
          .update({
            title: modalTitle.trim(),
            description: modalDescription.trim() || null,
            start_time: modalStartTime || null,
            end_time: modalEndTime || null,
            priority: modalPriority,
            status: modalStatus,
            is_completed: isCompleted,
            notes: modalNotes.trim() || null,
            color: modalColor,
          })
          .eq('id', editingTask.id)
          .select()
          .single()

        if (error) throw error
        setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? data : t)))
      } else {
        const targetDayId = taskModalDayId || selectedDay?.id
        if (!targetDayId) return

        const { data, error } = await supabase
          .from('tasks')
          .insert({
            schedule_day_id: targetDayId,
            schedule_id: scheduleId,
            user_id: user.id,
            title: modalTitle.trim(),
            description: modalDescription.trim() || null,
            start_time: modalStartTime || null,
            end_time: modalEndTime || null,
            priority: modalPriority,
            status: modalStatus,
            is_completed: isCompleted,
            notes: modalNotes.trim() || null,
            color: modalColor,
            sort_order: tasks.length,
          })
          .select()
          .single()

        if (error) throw error
        if (data) setTasks((prev) => [...prev, data])
      }

      setIsTaskModalOpen(false)
    } catch (err) {
      console.error('Error saving task:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه المهمة؟')) return
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
    try {
      await supabase.from('tasks').delete().eq('id', taskId)
    } catch (err) {
      console.error('Error deleting task:', err)
      loadScheduleData()
    }
  }

  // Habits Handlers for monthly view
  const handleToggleHabitDate = async (habitId: string, dateStr: string) => {
    if (!user) return
    const key = `${habitId}_${dateStr}`
    const isDone = !!habitLogs[key]

    setHabitLogs((prev) => {
      const next = { ...prev }
      if (isDone) delete next[key]
      else next[key] = true
      return next
    })

    try {
      if (isDone) {
        await supabase
          .from('habit_logs')
          .delete()
          .eq('habit_id', habitId)
          .eq('date', dateStr)
          .eq('user_id', user.id)
      } else {
        await supabase
          .from('habit_logs')
          .upsert(
            { habit_id: habitId, user_id: user.id, date: dateStr, is_completed: true },
            { onConflict: 'habit_id,date' }
          )
      }
    } catch (err) {
      console.error('Error toggling habit:', err)
    }
  }

  const handleAddHabit = async (habitData: Partial<Habit>) => {
    if (!user) return
    try {
      const { data, error } = await supabase
        .from('habits')
        .insert({
          user_id: user.id,
          name: habitData.name,
          color: habitData.color || '#10b981',
          target_days_per_week: 7,
          sort_order: habits.length,
        })
        .select()
        .single()

      if (error) throw error
      if (data) setHabits((prev) => [...prev, data])
    } catch (err) {
      console.error('Error adding habit:', err)
    }
  }

  const handleDeleteHabit = async (habitId: string) => {
    if (!user) return
    if (!confirm('حذف هذه العادة؟')) return
    setHabits((prev) => prev.filter((h) => h.id !== habitId))
    try {
      await supabase.from('habits').delete().eq('id', habitId).eq('user_id', user.id)
    } catch (err) {
      console.error('Error deleting habit:', err)
    }
  }

  return (
    <div className="space-y-6">
      {/* 1. Header with Breadcrumb & Schedule Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/schedules"
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
            title="العودة للجداول"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                {schedule?.name || 'تفاصيل الجدول'}
              </h1>
              <Badge variant="info" className="bg-teal-500/20 text-teal-300 border-teal-500/30">
                {schedule?.type === 'weekly' ? 'أسبوعي' : 'مخصص'}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              تحكم كامل في المهام والأوقات والعادات ونسب الإنجاز التلقائية
            </p>
          </div>
        </div>

        {/* Action Link to Templates */}
        <Link
          href="/dashboard/templates"
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-teal-500/40 transition-all shadow-sm"
        >
          <Layers className="w-3.5 h-3.5 text-teal-400" />
          <span>القوالب الجاهزة</span>
        </Link>
      </div>

      {/* 2. Unified View Switcher Toolbar (Daily / Weekly / Monthly) */}
      <ViewSwitcher
        currentView={viewMode}
        onViewChange={(vm) => setViewMode(vm)}
        currentDate={currentDate}
        onDateChange={handleDateChange}
        onTodayClick={() => handleDateChange(new Date())}
      />

      {/* 3. Real-time KPI Stats Bar */}
      <KPIStatsBar
        completionRate={dayStats.rate}
        completedCount={dayStats.completed}
        remainingCount={dayStats.remaining}
        cancelledCount={dayStats.cancelled}
        streakDays={streakStats.currentStreak}
        dateLabel={viewMode === 'daily' ? 'إنجاز اليوم المختار' : 'إجمالي الإنجاز'}
      />

      {/* 4. Dynamic Views */}
      {viewMode === 'daily' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Tasks Table (8 cols) */}
          <div className="lg:col-span-8">
            <DailyTaskTableView
              tasks={selectedDayTasks}
              categories={categories}
              onToggleTask={handleToggleTask}
              onUpdateStatus={handleUpdateStatus}
              onAddTask={handleQuickAddTask}
              onEditTask={handleOpenEditModal}
              onDeleteTask={handleDeleteTask}
            />
          </div>

          {/* Right Side Widgets (4 cols) matching Image Quadrant 1 */}
          <div className="lg:col-span-4 space-y-5">
            {/* Widget 1: Circular Radial Progress */}
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl flex flex-col items-center justify-center text-center">
              <span className="text-xs font-bold text-slate-400 mb-4">
                إجمالي الإنجاز اليوم
              </span>

              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-32 h-32 -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    stroke="currentColor"
                    strokeWidth="10"
                    className="text-slate-800"
                    fill="transparent"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    stroke="currentColor"
                    strokeWidth="10"
                    className="text-teal-400 transition-all duration-700 ease-out"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 52}
                    strokeDashoffset={
                      2 * Math.PI * 52 - (dayStats.rate / 100) * (2 * Math.PI * 52)
                    }
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-3xl font-black text-white">{dayStats.rate}%</span>
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-400 font-medium">
                {dayStats.completed} من أصل {dayStats.required} مهام مطلوبة
              </div>
            </div>

            {/* Widget 2: Weekly Performance Bars */}
            <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl">
              <span className="text-xs font-bold text-slate-400 mb-4 block">
                أداء الأيام في هذا الجدول
              </span>

              <div className="h-28 flex items-end justify-between gap-1.5 pt-2">
                {days.slice(0, 7).map((d) => {
                  const dTasks = tasksByDayId[d.id] || []
                  const stats = calculateDayCompletion(dTasks)
                  const isCurrent = d.id === selectedDay?.id
                  const dayNameShort = new Intl.DateTimeFormat('ar-SA', { weekday: 'short' }).format(new Date(d.date))

                  return (
                    <div
                      key={d.id}
                      onClick={() => handleSelectDay(d)}
                      className="flex-1 flex flex-col items-center gap-1.5 cursor-pointer group"
                    >
                      <div
                        className={`w-full max-w-[28px] rounded-t-lg transition-all duration-500 relative flex items-start justify-center pt-1 ${
                          isCurrent
                            ? 'bg-teal-400 shadow-md shadow-teal-500/30'
                            : stats.is100Percent
                            ? 'bg-emerald-500/80'
                            : 'bg-slate-800 hover:bg-slate-700'
                        }`}
                        style={{ height: `${Math.max(16, (stats.rate / 100) * 75)}px` }}
                      >
                        <span className="text-[9px] font-bold text-slate-950 font-mono">
                          {stats.rate}%
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-medium transition-colors ${
                          isCurrent ? 'text-teal-400 font-bold' : 'text-slate-400'
                        }`}
                      >
                        {dayNameShort}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'weekly' && (
        <WeeklyScheduleGridView
          days={days}
          tasksByDayId={tasksByDayId}
          selectedDateStr={selectedDay?.date || ''}
          onSelectDay={handleSelectDay}
          onToggleTask={handleToggleTask}
          onAddTaskToDay={handleOpenModalForDay}
        />
      )}

      {viewMode === 'monthly' && (
        <MonthlyHabitsTrackerView
          habits={habits}
          habitLogs={habitLogs}
          currentDate={currentDate}
          onToggleHabitDate={handleToggleHabitDate}
          onAddHabit={handleAddHabit}
          onDeleteHabit={handleDeleteHabit}
        />
      )}

      {/* 5. Add / Edit Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-white">
            <h4 className="text-base font-bold mb-4 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-teal-400" />
              <span>{editingTask ? 'تعديل المهمة' : 'إضافة مهمة جديدة'}</span>
            </h4>

            <form onSubmit={handleSaveModalTask} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  اسم المهمة *
                </label>
                <input
                  type="text"
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                  placeholder="اكتب اسم المهمة..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  required
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">
                    وقت البداية
                  </label>
                  <input
                    type="time"
                    value={modalStartTime}
                    onChange={(e) => setModalStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">
                    وقت النهاية
                  </label>
                  <input
                    type="time"
                    value={modalEndTime}
                    onChange={(e) => setModalEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">
                    الأولوية
                  </label>
                  <select
                    value={modalPriority}
                    onChange={(e) => setModalPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    <option value="urgent">عاجلة</option>
                    <option value="high">عالية</option>
                    <option value="medium">متوسطة</option>
                    <option value="low">منخفضة</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">
                    الحالة
                  </label>
                  <select
                    value={modalStatus}
                    onChange={(e) => setModalStatus(e.target.value as TaskStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    <option value="not_started">لم تبدأ</option>
                    <option value="in_progress">قيد التنفيذ</option>
                    <option value="completed">مكتملة</option>
                    <option value="postponed">مؤجلة</option>
                    <option value="cancelled">ملغاة</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1">
                  ملاحظات إضافية
                </label>
                <textarea
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  rows={2}
                  placeholder="ملاحظات أو تفاصيل المهمة..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !modalTitle.trim()}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 transition-all shadow-md shadow-teal-500/20 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'جاري الحفظ...' : editingTask ? 'تحديث المهمة' : 'إضافة المهمة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
