'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui'
import {
  SpatialCard,
  InteractiveEnergyCore,
} from '@/components/ui'
import {
  VisualDocIcon,
  VisualCheckIcon,
  VisualClockIcon,
  VisualLiquidRingIcon,
  HolographicClipboardVisual,
} from '@/components/dashboard/SpatialStatsVisuals'
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  Plus,
  Flame,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Sparkles,
  BarChart3,
  TrendingUp,
  Hourglass,
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
    <div className="space-y-7 animate-in fade-in duration-300 pb-16 max-w-7xl mx-auto">
      {/* ========================================================================= */}
      {/* 1. الصف العلوي: بانر الترحيب البانورامي المنحني (Curved Aurora HUD Banner)   */}
      {/* ========================================================================= */}
      <div className="relative rounded-3xl overflow-hidden backdrop-blur-2xl bg-slate-900/40 border border-white/15 shadow-[0_12px_40px_0_rgba(0,0,0,0.45)]">
        {/* Background Multi-Colored Holographic Waveforms */}
        <div className="absolute inset-0 pointer-events-none opacity-45 overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 1200 220" preserveAspectRatio="none" fill="none">
            {/* Wave 1: Cyan / Blue */}
            <path
              d="M0 60 C 200 120, 400 20, 600 70 C 800 120, 1000 30, 1200 65"
              stroke="#22d3ee"
              strokeWidth="2.5"
              strokeLinecap="round"
              filter="drop-shadow(0 0 8px #06b6d4)"
            />
            {/* Wave 2: Magenta / Pink */}
            <path
              d="M0 100 C 220 30, 420 150, 620 90 C 820 40, 1020 140, 1200 110"
              stroke="#f43f5e"
              strokeWidth="2.5"
              strokeLinecap="round"
              filter="drop-shadow(0 0 8px #f43f5e)"
            />
            {/* Wave 3: Purple / Violet */}
            <path
              d="M0 130 C 180 180, 380 80, 580 140 C 780 190, 980 90, 1200 135"
              stroke="#c084fc"
              strokeWidth="2"
              strokeLinecap="round"
              filter="drop-shadow(0 0 8px #a855f7)"
            />
            {/* Wave 4: Amber / Gold */}
            <path
              d="M0 160 C 250 110, 450 190, 650 140 C 850 100, 1050 180, 1200 150"
              stroke="#fbbf24"
              strokeWidth="2"
              strokeLinecap="round"
              filter="drop-shadow(0 0 8px #f59e0b)"
            />
          </svg>
        </div>

        {/* Ambient Top Glow Blob */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-28 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 blur-3xl pointer-events-none" />

        {/* Banner Content Container */}
        <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-9 text-center space-y-3.5">
          {/* Main Greeting Heading */}
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-cairo drop-shadow-[0_2px_15px_rgba(255,255,255,0.25)]">
            مرحبًا، {profile?.full_name || 'Eslam'}
          </h1>

          {/* Subtitle Description */}
          <p className="text-xs sm:text-sm text-gray-300 font-medium max-w-2xl mx-auto leading-relaxed">
            {totalTasks === 0
              ? 'ليس لديك مهام مسجلة لهذا اليوم، ابدأ بإضافة مهامك وتنظيم جدولك لتحقيق أقصى إنتاجية!'
              : `لديك اليوم ${totalTasks} مهام مسجلة، أنجزت منها ${completedTasks} حتى الآن. استمر بتغذية مدارات طاقتك!`}
          </p>

          {/* Centered Glowing HUD Pill Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {/* Right Amber Pill: Streak */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-[0_0_15px_rgba(245,158,11,0.25)] backdrop-blur-md">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
              <span className="font-cairo">معدل الالتزام: 5 أيام متتالية</span>
            </div>

            {/* Left Cyan Pill: Today's Schedule */}
            <Link
              href="/dashboard/today"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-xs font-bold shadow-[0_0_15px_rgba(34,211,238,0.25)] hover:bg-cyan-900/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all cursor-pointer backdrop-blur-md"
            >
              <CalendarCheck className="w-4 h-4 text-cyan-400" />
              <span className="font-cairo">الجدول اليومي التفصيلي</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================================================= */}
      {/* 2. منطقة المنتصف: نواة الطاقة الكونية المركزية محاطة بالكروت الأربعة في صف متناسق أفقي      */}
      {/* ========================================================================================= */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-center">
        {/* كارت 1 (أقصى اليمين في RTL): إجمالي المهام */}
        <SpatialCard
          neonGlow="cyan"
          tiltEnabled={true}
          popZ={24}
          className="p-5 flex flex-col justify-between h-52 bg-slate-900/60 border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.15)]"
        >
          {/* Card Top Row: Title (Right) + Count (Left) */}
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold text-gray-200 font-cairo">إجمالي المهام</span>
            <span className="text-2xl font-black text-white font-cairo">{totalTasks}</span>
          </div>

          {/* Card Bottom: 3D Glowing Document Icon */}
          <div className="flex items-center justify-center my-auto">
            <VisualDocIcon />
          </div>
        </SpatialCard>

        {/* كارت 2 (الثاني من اليمين في RTL): المهام المنجزة */}
        <SpatialCard
          neonGlow="emerald"
          tiltEnabled={true}
          popZ={24}
          className="p-5 flex flex-col justify-between h-52 bg-slate-900/60 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
        >
          {/* Card Top Row: Title (Right) + Count (Left) */}
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold text-gray-200 font-cairo">المهام المنجزة</span>
            <span className="text-2xl font-black text-white font-cairo">{completedTasks}</span>
          </div>

          {/* Card Bottom: 3D Glowing Emerald Checkmark Disc */}
          <div className="flex items-center justify-center my-auto">
            <VisualCheckIcon />
          </div>
        </SpatialCard>

        {/* المركز الرئيسي: نواة الطاقة الكونية ثلاثية الأبعاد (Interactive 3D Energy Core) */}
        <div className="col-span-2 md:col-span-1 flex items-center justify-center relative py-2">
          {/* Under-Core Reflective Ground Light Aura */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-10 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* The Multi-Colored 3D Reactor Core */}
          <InteractiveEnergyCore
            completionRate={completionPercentage}
            streakDays={5}
            size={240}
            showBadge={false}
          />
        </div>

        {/* كارت 3 (الثاني من اليسار في RTL): المهام الحالية */}
        <SpatialCard
          neonGlow="amber"
          tiltEnabled={true}
          popZ={24}
          className="p-5 flex flex-col justify-between h-52 bg-slate-900/60 border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
        >
          {/* Card Top Row: Title (Right) + Count (Left) */}
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold text-gray-200 font-cairo">المهام الحالية</span>
            <span className="text-2xl font-black text-white font-cairo">{remainingTasks}</span>
          </div>

          {/* Card Bottom: 3D Glowing Chronometer Gear Clock */}
          <div className="flex items-center justify-center my-auto">
            <VisualClockIcon />
          </div>
        </SpatialCard>

        {/* كارت 4 (أقصى اليسار في RTL): نسبة الإنجاز */}
        <SpatialCard
          neonGlow="purple"
          tiltEnabled={true}
          popZ={24}
          className="p-5 flex flex-col justify-between h-52 bg-slate-900/60 border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
        >
          {/* Card Top Row: Title (Right) + Count (Left) */}
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold text-gray-200 font-cairo">نسبة الإنجاز</span>
            <span className="text-2xl font-black text-white font-cairo">{completionPercentage}%</span>
          </div>

          {/* Card Bottom: 3D Glowing Plasma Wave Ring */}
          <div className="flex items-center justify-center my-auto">
            <VisualLiquidRingIcon percentage={completionPercentage} />
          </div>
        </SpatialCard>
      </div>

      {/* ========================================================================================= */}
      {/* 3. الصف السفلي: قسم "جداول النشاط والمهام القادمة" (اليسار) + قسم "مهام اليوم" (اليمين)     */}
      {/* ========================================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* الجانب الأيمن (Right in RTL - 7 Cols): قسم "مهام اليوم" مع الهولاجرام وزر الإضافة */}
        <div className="lg:col-span-7">
          <SpatialCard
            neonGlow="cyan"
            tiltEnabled={false}
            className="p-6 sm:p-7 bg-slate-900/50 border-cyan-500/20 min-h-[260px] flex flex-col justify-between"
          >
            {/* Header & Date Navigation */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white font-cairo">مهام اليوم</h3>
                {isTodayDate && (
                  <Badge variant="success" size="sm">
                    اليوم
                  </Badge>
                )}
              </div>

              {/* Day Switch Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => changeDate(-1)}
                  className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
                  title="اليوم السابق"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                  className="px-3 py-1 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-200 transition-colors font-cairo"
                >
                  اليوم الحالي
                </button>
                <button
                  onClick={() => changeDate(1)}
                  className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
                  title="اليوم التالي"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body: Empty Hologram or Task List */}
            {todayTasks.length === 0 ? (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-6">
                {/* 3D Floating Holographic Task Clipboard Graphic */}
                <div className="flex-shrink-0">
                  <HolographicClipboardVisual />
                </div>

                {/* Text Description & Glowing Action Button */}
                <div className="flex-1 text-right space-y-3">
                  <h4 className="text-base font-bold text-white font-cairo">
                    لا توجد مهام مسجلة لهذا اليوم
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed max-w-md">
                    أضف مهام جديدة لجدولك اليومي هذا وابدأ رحلتك لخطة مسددة وراقب مدارات طاقتك وهي تتسارع.
                  </p>

                  <div className="pt-2">
                    <Link
                      href="/dashboard/today"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 font-black text-xs shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] hover:scale-105 active:scale-95 transition-all font-cairo"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>إضافة مهمة الآن</span>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 mt-4">
                {todayTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task)}
                    className={`flex items-start gap-3.5 p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                      task.is_completed
                        ? 'bg-slate-900/30 border-white/5 opacity-60'
                        : 'bg-slate-900/60 border-white/10 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/10'
                    }`}
                  >
                    <div className="pt-0.5">
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                          task.is_completed
                            ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                            : 'border-white/20 bg-white/5'
                        }`}
                      >
                        {task.is_completed && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 text-right">
                      <p
                        className={`text-sm font-bold truncate ${
                          task.is_completed ? 'line-through text-gray-500' : 'text-white'
                        }`}
                      >
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        {task.start_time && (
                          <span className="text-[11px] text-gray-400 flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3 text-cyan-400" />
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
                ))}
              </div>
            )}
          </SpatialCard>
        </div>

        {/* الجانب الأيسر (Left in RTL - 5 Cols): قسم "جداول النشاط" و "المهام القادمة" */}
        <div className="lg:col-span-5">
          <SpatialCard
            neonGlow="indigo"
            tiltEnabled={false}
            className="p-6 bg-slate-900/50 border-indigo-500/20 min-h-[260px] flex flex-col justify-between"
          >
            {/* 2x2 Bento Sub-Tiles Grid matching the reference image */}
            <div className="grid grid-cols-2 gap-3.5 h-full">
              {/* Tile 1: جداول النشاط (Top Right) */}
              <Link
                href="/dashboard/schedules"
                className="p-4 rounded-2xl bg-slate-950/70 border border-amber-500/30 hover:border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.15)] flex flex-col justify-between transition-all hover:scale-[1.02] group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-cairo group-hover:text-amber-400 transition-colors">
                    جداول النشاط
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Hourglass className="w-4 h-4 animate-pulse" />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-[10px] text-gray-400 leading-tight">
                    {activeSchedules.length > 0
                      ? `${activeSchedules.length} جداول نشطة مفعلة`
                      : 'دخول سينما الوقت والنشاط'}
                  </p>
                </div>
              </Link>

              {/* Tile 2: 3D Bar Chart Visual Graphic (Top Left) */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.15)] flex items-center justify-center">
                <div className="flex items-end gap-2 h-14 w-full justify-center px-2">
                  <div className="w-3 rounded-t-md bg-purple-500 h-8 shadow-[0_0_8px_#a855f7]" />
                  <div className="w-3 rounded-t-md bg-cyan-400 h-14 shadow-[0_0_8px_#22d3ee]" />
                  <div className="w-3 rounded-t-md bg-amber-400 h-10 shadow-[0_0_8px_#fbbf24]" />
                  <div className="w-3 rounded-t-md bg-rose-500 h-6 shadow-[0_0_8px_#f43f5e]" />
                </div>
              </div>

              {/* Tile 3: المهام القادمة (Bottom Right) */}
              <Link
                href="/dashboard/today"
                className="p-4 rounded-2xl bg-slate-950/70 border border-purple-500/30 hover:border-purple-400/60 shadow-[0_0_15px_rgba(168,85,247,0.15)] flex flex-col justify-between transition-all hover:scale-[1.02] group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-cairo group-hover:text-purple-400 transition-colors">
                    المهام القادمة
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                    <CalendarDays className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-[10px] text-gray-400 leading-tight">
                    {upcomingTasks.length > 0
                      ? `${upcomingTasks.length} مهام خلال 7 أيام`
                      : 'أضف مهام لتبقى الإنتاجية'}
                  </p>
                </div>
              </Link>

              {/* Tile 4: 3D Performance Chart Visual Graphic (Bottom Left) */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)] flex items-center justify-center">
                <div className="flex items-end gap-2 h-14 w-full justify-center px-2">
                  <div className="w-3 rounded-t-md bg-rose-500 h-6 shadow-[0_0_8px_#f43f5e]" />
                  <div className="w-3 rounded-t-md bg-amber-400 h-9 shadow-[0_0_8px_#fbbf24]" />
                  <div className="w-3 rounded-t-md bg-cyan-400 h-11 shadow-[0_0_8px_#22d3ee]" />
                  <div className="w-3 rounded-t-md bg-emerald-400 h-14 shadow-[0_0_8px_#34d399]" />
                </div>
              </div>
            </div>
          </SpatialCard>
        </div>
      </div>
    </div>
  )
}
