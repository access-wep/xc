'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { Card, Button, ProgressBar, Badge } from '@/components/ui'
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  ListTodo,
  TrendingUp,
  AlertCircle,
  Plus,
  Flame,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from 'lucide-react'
import type { Task, Schedule, ScheduleDay } from '@/types/database'

export default function DashboardOverviewPage() {
  const { user, profile } = useAuth()
  const supabase = createClient()

  const [isLoading, setIsLoading] = useState(true)
  const [todayTasks, setTodayTasks] = useState<Task[]>([])
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([])
  const [activeSchedules, setActiveSchedules] = useState<Schedule[]>([])
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  )

  // Calculated Stats
  const totalTasks = todayTasks.filter((t) => t.status !== 'cancelled').length
  const completedTasks = todayTasks.filter(
    (t) => t.is_completed && t.status !== 'cancelled'
  ).length
  const remainingTasks = Math.max(0, totalTasks - completedTasks)
  const completionPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Fetch Dashboard Data
  const loadDashboardData = async () => {
    if (!user) return
    setIsLoading(true)

    try {
      // 1. Fetch user's active schedules
      const { data: schedules } = await supabase
        .from('schedules')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      setActiveSchedules(schedules || [])

      // 2. Fetch tasks for selectedDate
      // First get schedule_days for this date
      const { data: days } = await supabase
        .from('schedule_days')
        .select('id, schedule_id')
        .eq('date', selectedDate)

      if (days && days.length > 0) {
        const dayIds = days.map((d) => d.id)
        const { data: tasks } = await supabase
          .from('tasks')
          .select('*')
          .in('schedule_day_id', dayIds)
          .order('sort_order', { ascending: true })

        setTodayTasks(tasks || [])
      } else {
        setTodayTasks([])
      }

      // 3. Fetch upcoming tasks (next 7 days)
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const nextWeek = new Date()
      nextWeek.setDate(nextWeek.getDate() + 7)

      const { data: upcomingDays } = await supabase
        .from('schedule_days')
        .select('id, date')
        .gte('date', tomorrow.toISOString().split('T')[0])
        .lte('date', nextWeek.toISOString().split('T')[0])

      if (upcomingDays && upcomingDays.length > 0) {
        const upIds = upcomingDays.map((d) => d.id)
        const { data: upTasks } = await supabase
          .from('tasks')
          .select('*')
          .in('schedule_day_id', upIds)
          .eq('is_completed', false)
          .limit(5)

        setUpcomingTasks(upTasks || [])
      } else {
        setUpcomingTasks([])
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [user, selectedDate])

  // Toggle Task Completion
  const toggleTask = async (task: Task) => {
    const updatedStatus = !task.is_completed
    const newStatus = updatedStatus ? 'completed' : 'not_started'

    // Optimistic UI update
    setTodayTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? { ...t, is_completed: updatedStatus, status: newStatus as any }
          : t
      )
    )

    try {
      await supabase
        .from('tasks')
        .update({
          is_completed: updatedStatus,
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', task.id)
    } catch (err) {
      console.error('Failed to update task:', err)
      loadDashboardData() // Revert on failure
    }
  }

  // Quick Date Navigation
  const changeDate = (daysOffset: number) => {
    const d = new Date(selectedDate)
    d.setDate(d.getDate() + daysOffset)
    setSelectedDate(d.toISOString().split('T')[0])
  }

  const isTodayDate = selectedDate === new Date().toISOString().split('T')[0]

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-l from-indigo-600 via-indigo-700 to-purple-700 p-6 sm:p-8 text-white shadow-xl shadow-indigo-500/20 overflow-hidden">
        {/* Background glow & shapes */}
        <div className="absolute top-0 end-0 -mt-8 -me-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 start-0 -mb-8 -ms-8 w-48 h-48 bg-purple-500/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-medium text-indigo-100 mb-3 backdrop-blur-sm">
              <Flame className="w-3.5 h-3.5 text-amber-300" />
              <span>معدل الالتزام: 5 أيام متتالية 🔥</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              مرحبًا، {profile?.full_name || 'صديقنا المبدع'} 👋
            </h1>
            <p className="mt-2 text-indigo-100 text-sm sm:text-base max-w-xl">
              {totalTasks === 0
                ? 'ليس لديك مهام مسجلة لهذا اليوم. ابدأ بإضافة مهامك وتنظيم جدولك لتحقيق أقصى إنتاجية!'
                : `لديك اليوم ${totalTasks} مهام، قمت بإنجاز ${completedTasks} منها حتى الآن. استمر بالتقدم!`}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href="/dashboard/today"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-600 font-semibold text-sm hover:bg-indigo-50 transition-all shadow-md active:scale-95"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>جدول اليوم التفصيلي</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Tasks */}
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
            <ListTodo className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              إجمالي المهام
            </p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
              {totalTasks}
            </h3>
          </div>
        </Card>

        {/* Completed */}
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              المهام المنجزة
            </p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
              {completedTasks}
            </h3>
          </div>
        </Card>

        {/* Remaining */}
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              المهام المتبقية
            </p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
              {remainingTasks}
            </h3>
          </div>
        </Card>

        {/* Completion Percentage */}
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              نسبة الإنجاز
            </p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
              {completionPercentage}%
            </h3>
          </div>
        </Card>
      </div>

      {/* Progress Bar Row */}
      {totalTasks > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              مستوى إنجاز مهام اليوم
            </span>
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
              {completedTasks} من {totalTasks} مهام مكتملة
            </span>
          </div>
          <ProgressBar value={completedTasks} max={totalTasks} size="lg" />
        </Card>
      )}

      {/* Main Content Layout: Tasks + Calendar / Schedules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Selected Day Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            {/* Header & Date Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>مهام اليوم</span>
                  {isTodayDate && (
                    <Badge variant="success" size="sm">
                      اليوم
                    </Badge>
                  )}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(selectedDate).toLocaleDateString('ar-SA', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              {/* Day Switch Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => changeDate(-1)}
                  className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="اليوم السابق"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setSelectedDate(new Date().toISOString().split('T')[0])
                  }
                  className="px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  اليوم الحالي
                </button>
                <button
                  onClick={() => changeDate(1)}
                  className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="اليوم التالي"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tasks List */}
            <div className="mt-4 space-y-3">
              {todayTasks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center mx-auto mb-3">
                    <ListTodo className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    لا توجد مهام مسجلة لهذا التاريخ
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    أضف مهام جديدة لجدولك لتظهر هنا وتتابع إنجازها لحظة بلحظة.
                  </p>
                  <Link
                    href="/dashboard/today"
                    className="inline-flex items-center gap-1.5 mt-4 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة مهمة الآن</span>
                  </Link>
                </div>
              ) : (
                todayTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task)}
                    className={`flex items-start gap-3.5 p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                      task.is_completed
                        ? 'bg-gray-50/60 dark:bg-gray-900/40 border-gray-100 dark:border-gray-800 opacity-70'
                        : 'bg-white dark:bg-gray-800/80 border-gray-200/80 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-sm'
                    }`}
                  >
                    {/* Checkbox */}
                    <div className="pt-0.5">
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                          task.is_completed
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                        }`}
                      >
                        {task.is_completed && (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                      </div>
                    </div>

                    {/* Task Info */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-semibold truncate ${
                          task.is_completed
                            ? 'line-through text-gray-400 dark:text-gray-500'
                            : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        {task.start_time && (
                          <span className="text-[11px] text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            {task.start_time.slice(0, 5)}
                            {task.end_time && ` - ${task.end_time.slice(0, 5)}`}
                          </span>
                        )}
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
                            ? 'أولوية عالية'
                            : task.priority === 'medium'
                            ? 'متوسط'
                            : 'منخفض'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Right 1 Col: Active Schedules & Upcoming Tasks */}
        <div className="space-y-6">
          {/* Active Schedules Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-base">
                <CalendarDays className="w-5 h-5 text-indigo-500" />
                <span>جداولي النشطة</span>
              </h3>
              <Link
                href="/dashboard/schedules"
                className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>الكل</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            {activeSchedules.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-xs text-gray-500">لا توجد جداول منشأة بعد.</p>
                <Link
                  href="/dashboard/schedules?create=true"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
                >
                  <Plus className="w-3 h-3" />
                  <span>إنشاء جدولك الأول</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {activeSchedules.slice(0, 3).map((schedule) => (
                  <Link
                    key={schedule.id}
                    href={`/dashboard/schedules/${schedule.id}`}
                    className="block p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm text-gray-900 dark:text-white">
                        {schedule.name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-medium">
                        {schedule.type === 'daily'
                          ? 'يومي'
                          : schedule.type === 'weekly'
                          ? 'أسبوعي'
                          : schedule.type === 'monthly'
                          ? 'شهري'
                          : schedule.type === 'yearly'
                          ? 'سنوي'
                          : 'مخصص'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      من {schedule.start_date} إلى {schedule.end_date}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </Card>

          {/* Upcoming Tasks Card */}
          <Card className="p-6">
            <h3 className="font-bold text-gray-900 dark:text-white text-base mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-500" />
              <span>المهام القادمة</span>
            </h3>

            {upcomingTasks.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-4">
                لا توجد مهام قادمة خلال الأيام السبعة القادمة.
              </p>
            ) : (
              <div className="space-y-2.5">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 text-xs flex items-center justify-between"
                  >
                    <span className="font-medium text-gray-800 dark:text-gray-200 truncate">
                      {task.title}
                    </span>
                    <Badge variant="outline" size="sm">
                      {task.priority === 'high' ? 'مهم' : 'عادي'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
