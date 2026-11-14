'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui'
import {
  SpatialCard,
  InteractiveEnergyCore,
  SpatialProgressRing,
} from '@/components/ui'
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
  Sparkles,
  Zap,
  Activity,
  Layers,
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
      console.error('Failed to load dashboard overview data:', err)
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
      loadDashboardData()
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
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* ========================================================= */}
      {/* 1. المنطقة العليا: بانر الترحيب العريض (Aurora Glass Banner) */}
      {/* ========================================================= */}
      <SpatialCard
        neonGlow="indigo"
        tiltEnabled={false}
        className="p-6 sm:p-8 bg-gradient-to-r from-indigo-950/70 via-slate-900/90 to-purple-950/70 border-white/10"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl text-right">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-indigo-300 backdrop-blur-md shadow-inner">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
              <span className="font-cairo">مؤشر الاستمرارية: 5 أيام متتالية متوهجة 🔥</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-cairo">
              مرحبًا، {profile?.full_name || 'صديقنا المبدع'} 👋
            </h1>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              {totalTasks === 0
                ? 'ليس لديك مهام مجدولة لهذا التاريخ. ابدأ بإضافة مهامك اليومية وشحن نواة طاقتك المركزية لتحقيق إنتاجية استثنائية!'
                : `لديك اليوم ${totalTasks} مهام، قمت بإنجاز ${completedTasks} منها حتى الآن. نواة طاقتك المركزية محاطة بمدارات نشطة تتفاعل لحظياً مع تقدمك!`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 flex-shrink-0 self-stretch md:self-auto justify-end">
            <Link
              href="/dashboard/today"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.03] active:scale-95 transition-all"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>جدول اليوم التفصيلي</span>
            </Link>

            <Link
              href="/dashboard/schedules?create=true"
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-sm font-semibold transition-all hover:scale-[1.02] active:scale-95 backdrop-blur-md"
            >
              <Plus className="w-4 h-4 text-indigo-400" />
              <span>إنشاء جدول جديد</span>
            </Link>
          </div>
        </div>
      </SpatialCard>

      {/* ============================================================================= */}
      {/* 2. المنطقة الوسطى: نواة الطاقة المركزية الكبرى محاطة بكروت الإحصائيات الأربعة  */}
      {/* ============================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* الجانب الأيمن (Right Wing): كارت إجمالي المهام + كارت المهام المنجزة */}
        <div className="lg:col-span-3 flex flex-col gap-5 justify-between">
          {/* كارت 1: إجمالي المهام */}
          <SpatialCard
            neonGlow="indigo"
            tiltEnabled={true}
            popZ={24}
            className="p-6 flex-1 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400">إجمالي المهام</span>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <ListTodo className="w-6 h-6 stroke-[2.2]" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl sm:text-4xl font-black text-white font-cairo">
                {totalTasks}
              </h3>
              <p className="text-[11px] text-gray-400 mt-1">كافة المهام المجدولة لتاريخ اليوم</p>
            </div>
          </SpatialCard>

          {/* كارت 2: المهام المنجزة */}
          <SpatialCard
            neonGlow="emerald"
            tiltEnabled={true}
            popZ={24}
            className="p-6 flex-1 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400">المهام المنجزة</span>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl sm:text-4xl font-black text-emerald-400 font-cairo">
                {completedTasks}
              </h3>
              <p className="text-[11px] text-gray-400 mt-1">مهام مكتملة بنجاح 100%</p>
            </div>
          </SpatialCard>
        </div>

        {/* المركز الرئيسي: نواة الطاقة ثلاثية الأبعاد الكبرى (Central 3D Energy Core) */}
        <div className="lg:col-span-6 flex">
          <SpatialCard
            neonGlow={completionPercentage >= 80 ? 'emerald' : completionPercentage >= 40 ? 'cyan' : 'purple'}
            tiltEnabled={true}
            popZ={26}
            className="w-full p-6 sm:p-8 flex flex-col items-center justify-between text-center relative overflow-hidden bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-slate-950 border-white/10"
          >
            {/* Top Core Header Badge */}
            <div className="flex flex-col items-center space-y-1.5 z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-gray-200 backdrop-blur-md">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-cairo">نواة الطاقة المركزية (Interactive 3D Core)</span>
              </div>
              <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
                تتسارع المدارات الضوئية وتتوهج حلقاتها الفراغية لحظياً مع كل مهمة تنجزها
              </p>
            </div>

            {/* Central Giant 3D Canvas Energy Core */}
            <div className="py-2 z-10 my-auto">
              <InteractiveEnergyCore
                completionRate={completionPercentage}
                streakDays={5}
                size={270}
                showBadge={true}
                showAura={true}
              />
            </div>

            {/* Bottom Real-time Telemetry Bar */}
            <div className="w-full grid grid-cols-3 gap-2 pt-4 border-t border-white/10 text-center z-10">
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="text-[10px] text-gray-400 font-medium">معدل الطاقة</div>
                <div className="text-sm sm:text-base font-black text-white font-cairo mt-0.5">
                  {completionPercentage}%
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="text-[10px] text-gray-400 font-medium">المهام النشطة</div>
                <div className="text-sm sm:text-base font-black text-cyan-400 font-cairo mt-0.5">
                  {completedTasks}/{totalTasks}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="text-[10px] text-gray-400 font-medium">حالة المدار</div>
                <div className="text-[11px] sm:text-xs font-bold text-emerald-400 font-cairo mt-1 truncate">
                  {completionPercentage >= 80 ? 'طاقة قصوى' : completionPercentage >= 40 ? 'متسارع نشط' : 'قيد الشحن'}
                </div>
              </div>
            </div>
          </SpatialCard>
        </div>

        {/* الجانب الأيسر (Left Wing): كارت المهام المتبقية + كارت نسبة الإنجاز مع الـ 3D Ring */}
        <div className="lg:col-span-3 flex flex-col gap-5 justify-between">
          {/* كارت 3: المهام الحالية / المتبقية */}
          <SpatialCard
            neonGlow="cyan"
            tiltEnabled={true}
            popZ={24}
            className="p-6 flex-1 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400">المهام المتبقية</span>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                <Clock className="w-6 h-6 stroke-[2.2]" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl sm:text-4xl font-black text-cyan-400 font-cairo">
                {remainingTasks}
              </h3>
              <p className="text-[11px] text-gray-400 mt-1">مهام تتطلب إتمامك اليوم</p>
            </div>
          </SpatialCard>

          {/* كارت 4: نسبة الإنجاز مع حلقة 3D Ring */}
          <SpatialCard
            neonGlow="amber"
            tiltEnabled={true}
            popZ={24}
            className="p-6 flex-1 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400">نسبة الإنجاز</span>
              <SpatialProgressRing
                percentage={completionPercentage}
                size={54}
                strokeWidth={5}
                glowColor={completionPercentage >= 80 ? 'emerald' : completionPercentage >= 40 ? 'cyan' : 'amber'}
                showText={false}
              />
            </div>
            <div className="mt-4">
              <h3 className="text-3xl sm:text-4xl font-black text-white font-cairo">
                {completionPercentage}%
              </h3>
              <p className="text-[11px] text-gray-400 mt-1">التقدم الكلي لليوم الحالي</p>
            </div>
          </SpatialCard>
        </div>
      </div>

      {/* ====================================================================================== */}
      {/* 3. المنطقة السفلية: قسم مهام اليوم (الأيمن) + جداول النشاط والمهام القادمة (الأيسر)      */}
      {/* ====================================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* الجانب الأيمن (Right - 2 Cols in RTL): قسم مهام اليوم التفصيلي مع الهولاجرام العائم */}
        <div className="lg:col-span-2 space-y-6">
          <SpatialCard
            neonGlow="none"
            tiltEnabled={false}
            className="p-6 sm:p-7 bg-slate-900/60 border-white/10"
          >
            {/* Header & Date Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2 font-cairo">
                  <span>مهام اليوم</span>
                  {isTodayDate && (
                    <Badge variant="success" size="sm">
                      اليوم الحالي
                    </Badge>
                  )}
                </h2>
                <p className="text-xs text-gray-400 mt-1">
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
                  className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 transition-colors cursor-pointer"
                  title="اليوم السابق"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setSelectedDate(new Date().toISOString().split('T')[0])
                  }
                  className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-200 transition-colors cursor-pointer font-cairo"
                >
                  اليوم الحالي
                </button>
                <button
                  onClick={() => changeDate(1)}
                  className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 transition-colors cursor-pointer"
                  title="اليوم التالي"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tasks List / Holographic Empty State */}
            <div className="mt-6 space-y-3">
              {todayTasks.length === 0 ? (
                /* Holographic Empty State */
                <div className="relative p-12 text-center rounded-3xl border border-dashed border-white/15 bg-white/[0.02] overflow-hidden my-4">
                  {/* Subtle Glow backdrop */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                    <Sparkles className="w-8 h-8 animate-pulse text-indigo-300" />
                  </div>

                  <h4 className="text-lg font-bold text-white mb-1.5 font-cairo">
                    لا توجد مهام مسجلة لهذا التاريخ
                  </h4>
                  <p className="text-xs text-gray-400 max-w-md mx-auto mb-6 leading-relaxed">
                    ابدأ يومك بتحديد أهدافك ومهامك اليومية، وراقب نواة طاقتك المركزية وهي تتوهج مع كل إنجاز تحققه.
                  </p>

                  <Link
                    href="/dashboard/today"
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all font-cairo"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة أول مهمة لليوم</span>
                  </Link>
                </div>
              ) : (
                todayTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task)}
                    className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                      task.is_completed
                        ? 'bg-slate-900/30 border-white/5 opacity-65'
                        : 'bg-slate-900/60 border-white/10 hover:border-indigo-400/50 hover:shadow-lg hover:shadow-indigo-500/10'
                    }`}
                  >
                    {/* Checkbox */}
                    <div className="pt-0.5">
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                          task.is_completed
                            ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                            : 'border-white/20 bg-white/5'
                        }`}
                      >
                        {task.is_completed && (
                          <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                        )}
                      </div>
                    </div>

                    {/* Task Info */}
                    <div className="flex-1 min-w-0 text-right">
                      <p
                        className={`text-sm font-bold truncate ${
                          task.is_completed
                            ? 'line-through text-gray-500'
                            : 'text-white'
                        }`}
                      >
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2.5">
                        {task.start_time && (
                          <span className="text-[11px] text-gray-400 flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3 text-indigo-400" />
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
          </SpatialCard>
        </div>

        {/* الجانب الأيسر (Left - 1 Col in RTL): جداول النشاط + المهام القادمة */}
        <div className="space-y-6">
          {/* قسم جداول النشاط */}
          <SpatialCard
            neonGlow="indigo"
            tiltEnabled={false}
            className="p-6 bg-slate-900/60 border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white flex items-center gap-2 text-base font-cairo">
                <CalendarDays className="w-5 h-5 text-indigo-400" />
                <span>جداول النشاط</span>
              </h3>
              <Link
                href="/dashboard/schedules"
                className="text-xs font-bold text-indigo-400 hover:underline flex items-center gap-1 font-cairo"
              >
                <span>عرض الكل</span>
                <ArrowUpRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </Link>
            </div>

            {activeSchedules.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-xs text-gray-400">لا توجد جداول نشطة حالياً.</p>
                <Link
                  href="/dashboard/schedules?create=true"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-indigo-400 hover:underline font-cairo"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إنشاء أول جدول</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {activeSchedules.slice(0, 3).map((schedule) => (
                  <Link
                    key={schedule.id}
                    href={`/dashboard/schedules/${schedule.id}`}
                    className="block p-3.5 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-indigo-500/40 hover:bg-white/[0.05] transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-white font-cairo">
                        {schedule.name}
                      </span>
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-bold">
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
                    <p className="text-xs text-gray-400">
                      من {schedule.start_date} إلى {schedule.end_date}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </SpatialCard>

          {/* قسم المهام القادمة */}
          <SpatialCard
            neonGlow="cyan"
            tiltEnabled={false}
            className="p-6 bg-slate-900/60 border-white/10"
          >
            <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2 font-cairo">
              <Clock className="w-5 h-5 text-cyan-400" />
              <span>المهام القادمة</span>
            </h3>

            {upcomingTasks.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">
                لا توجد مهام قادمة خلال الأيام السبعة القادمة.
              </p>
            ) : (
              <div className="space-y-2.5">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs flex items-center justify-between"
                  >
                    <span className="font-medium text-gray-200 truncate">
                      {task.title}
                    </span>
                    <Badge variant="outline" size="sm">
                      {task.priority === 'high' ? 'مهم' : 'عادي'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </SpatialCard>
        </div>
      </div>
    </div>
  )
}
