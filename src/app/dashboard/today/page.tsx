'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import {
  Button,
  Input,
  Card,
  Modal,
  Select,
  Textarea,
  Badge,
  ProgressBar,
} from '@/components/ui'
import {
  CalendarCheck2,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Sparkles,
  Flame,
  Check,
} from 'lucide-react'
import type { Task, TaskPriority, TaskStatus, Schedule } from '@/types/database'

export default function TodaySchedulePage() {
  const { user } = useAuth()
  const supabase = createClient()

  const [tasks, setTasks] = useState<Task[]>([])
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Quick Add / Edit Task Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [status, setStatus] = useState<TaskStatus>('not_started')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const todayStr = new Date().toISOString().split('T')[0]
  const todayArabic = new Intl.DateTimeFormat('ar-SA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  // Load Today Tasks
  const loadTodayTasks = async () => {
    if (!user) return
    setIsLoading(true)

    try {
      // 1. Get user schedules
      const { data: userSchedules } = await supabase
        .from('schedules')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)

      setSchedules(userSchedules || [])
      if (userSchedules && userSchedules.length > 0) {
        setSelectedScheduleId(userSchedules[0].id)
      }

      // 2. Find schedule_days for today
      const { data: days } = await supabase
        .from('schedule_days')
        .select('id, schedule_id')
        .eq('date', todayStr)

      if (days && days.length > 0) {
        const dayIds = days.map((d) => d.id)
        const { data: todayTaskList } = await supabase
          .from('tasks')
          .select('*')
          .in('schedule_day_id', dayIds)
          .order('sort_order', { ascending: true })

        setTasks(todayTaskList || [])
      } else {
        setTasks([])
      }
    } catch (err) {
      console.error('Error fetching today tasks:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTodayTasks()
  }, [user])

  // Toggle Completion
  const toggleTask = async (task: Task) => {
    const nextCompleted = !task.is_completed
    const nextStatus = nextCompleted ? 'completed' : 'not_started'

    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? { ...t, is_completed: nextCompleted, status: nextStatus as any }
          : t
      )
    )

    try {
      await supabase
        .from('tasks')
        .update({
          is_completed: nextCompleted,
          status: nextStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', task.id)
    } catch (err) {
      console.error('Failed to toggle task:', err)
      loadTodayTasks()
    }
  }

  // Save Task
  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setIsSubmitting(true)

    try {
      if (editingTask) {
        await supabase
          .from('tasks')
          .update({
            title,
            description: description || null,
            start_time: startTime || null,
            end_time: endTime || null,
            priority,
            status,
            is_completed: status === 'completed',
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingTask.id)
      } else {
        // Need a schedule and schedule_day for today
        let targetScheduleId = selectedScheduleId
        if (!targetScheduleId) {
          // If no schedule exists, create a default daily schedule
          const { data: newSchedule } = await supabase
            .from('schedules')
            .insert({
              user_id: user.id,
              name: 'جدولي اليومي العام',
              type: 'daily',
              start_date: todayStr,
              end_date: todayStr,
              is_active: true,
            })
            .select()
            .single()

          targetScheduleId = newSchedule.id
        }

        // Check if schedule_day exists for today in this schedule
        let { data: day } = await supabase
          .from('schedule_days')
          .select('id')
          .eq('schedule_id', targetScheduleId)
          .eq('date', todayStr)
          .single()

        if (!day) {
          const { data: newDay } = await supabase
            .from('schedule_days')
            .insert({
              schedule_id: targetScheduleId,
              date: todayStr,
              day_name: new Intl.DateTimeFormat('ar-SA', { weekday: 'long' }).format(new Date()),
              is_completed: false,
              sort_order: 1,
            })
            .select()
            .single()
          day = newDay
        }

        if (day) {
          await supabase.from('tasks').insert({
            schedule_day_id: day.id,
            schedule_id: targetScheduleId,
            user_id: user.id,
            title,
            description: description || null,
            start_time: startTime || null,
            end_time: endTime || null,
            priority,
            status,
            is_completed: status === 'completed',
            sort_order: tasks.length + 1,
          })
        }
      }

      setIsModalOpen(false)
      setTitle('')
      setDescription('')
      setStartTime('')
      setEndTime('')
      setEditingTask(null)
      loadTodayTasks()
    } catch (err) {
      console.error('Error saving today task:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      await supabase.from('tasks').delete().eq('id', taskId)
      loadTodayTasks()
    } catch (err) {
      console.error('Error deleting task:', err)
    }
  }

  // Calculations
  const required = tasks.filter((t) => t.status !== 'cancelled')
  const completed = required.filter((t) => t.is_completed)
  const percent = required.length > 0 ? Math.round((completed.length / required.length) * 100) : 0
  const isFull = required.length > 0 && required.length === completed.length

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CalendarCheck2 className="w-6 h-6 text-indigo-600" />
              <span>جدول اليوم التفصيلي</span>
            </h1>
            {isFull && <Badge variant="success">إنجاز كامل 100% 🌟</Badge>}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {todayArabic}
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingTask(null)
            setTitle('')
            setDescription('')
            setStartTime('')
            setEndTime('')
            setIsModalOpen(true)
          }}
          variant="primary"
          className="gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة مهمة لليوم</span>
        </Button>
      </div>

      {/* Progress Metric Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              تقدم إنجاز مهام اليوم
            </h3>
            <p className="text-xs text-gray-500">
              تم إنجاز {completed.length} من أصل {required.length} مهام مطلوبة
            </p>
          </div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
            {percent}%
          </div>
        </div>
        <ProgressBar value={completed.length} max={Math.max(required.length, 1)} size="md" />
      </Card>

      {/* Tasks List */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          قائمة مهام اليوم ({tasks.length})
        </h2>

        {tasks.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              لا توجد مهام مجدولة لليوم حتى الآن
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto mt-1 mb-4">
              نظّم وقتك اليومي الآن بإضافة مهامك، وتحديد أوقاتها، لمتابعة إنجازك بدقة.
            </p>
            <Button
              onClick={() => {
                setEditingTask(null)
                setTitle('')
                setDescription('')
                setStartTime('')
                setEndTime('')
                setIsModalOpen(true)
              }}
              variant="primary"
              size="sm"
            >
              إضافة أول مهمة
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                  task.is_completed
                    ? 'bg-gray-50/70 dark:bg-gray-900/40 border-gray-100 dark:border-gray-800'
                    : 'bg-white dark:bg-gray-800/90 border-gray-200/80 dark:border-gray-700 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => toggleTask(task)}
                    className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer flex-shrink-0 ${
                      task.is_completed
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900'
                    }`}
                  >
                    {task.is_completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p
                        className={`text-sm font-bold truncate ${
                          task.is_completed
                            ? 'line-through text-gray-400 dark:text-gray-500'
                            : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        {task.title}
                      </p>
                      <Badge
                        variant={
                          task.priority === 'urgent'
                            ? 'danger'
                            : task.priority === 'high'
                            ? 'warning'
                            : 'default'
                        }
                        size="sm"
                      >
                        {task.priority === 'urgent'
                          ? 'عاجل'
                          : task.priority === 'high'
                          ? 'عالية'
                          : task.priority === 'medium'
                          ? 'متوسطة'
                          : 'منخفضة'}
                      </Badge>
                    </div>

                    {task.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {task.description}
                      </p>
                    )}

                    {(task.start_time || task.end_time) && (
                      <div className="flex items-center gap-1.5 mt-2 text-[11px] text-gray-400">
                        <Clock className="w-3 h-3 text-indigo-500" />
                        <span>
                          {task.start_time?.slice(0, 5)} - {task.end_time?.slice(0, 5)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingTask(task)
                      setTitle(task.title)
                      setDescription(task.description || '')
                      setStartTime(task.start_time || '')
                      setEndTime(task.end_time || '')
                      setPriority(task.priority)
                      setStatus(task.status)
                      setIsModalOpen(true)
                    }}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTask ? 'تعديل المهمة' : 'إضافة مهمة جديدة لليوم'}
      >
        <form onSubmit={handleSaveTask} className="space-y-4">
          {!editingTask && schedules.length > 1 && (
            <Select
              label="الجدول التابع له *"
              value={selectedScheduleId}
              onChange={(e) => setSelectedScheduleId(e.target.value)}
              options={schedules.map((s) => ({ value: s.id, label: s.name }))}
            />
          )}

          <Input
            label="اسم المهمة *"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="مثال: قراءة 20 صفحة، إنهاء الكود البرمجي..."
          />

          <Textarea
            label="تفاصيل المهمة"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="ملاحظات وتفاصيل إضافية..."
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="وقت البداية"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <Input
              label="وقت النهاية"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="الأولوية"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              options={[
                { value: 'low', label: 'منخفضة' },
                { value: 'medium', label: 'متوسطة' },
                { value: 'high', label: 'عالية' },
                { value: 'urgent', label: 'عاجلة' },
              ]}
            />

            <Select
              label="الحالة"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              options={[
                { value: 'not_started', label: 'لم تبدأ' },
                { value: 'in_progress', label: 'قيد التنفيذ' },
                { value: 'completed', label: 'مكتملة' },
                { value: 'postponed', label: 'مؤجلة' },
                { value: 'cancelled', label: 'ملغاة' },
              ]}
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              إلغاء
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {editingTask ? 'حفظ التعديل' : 'إضافة المهمة'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
