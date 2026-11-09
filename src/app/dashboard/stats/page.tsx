'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { Card, ProgressBar, Badge } from '@/components/ui'
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Calendar,
  Flame,
  Award,
  AlertCircle,
} from 'lucide-react'

export default function StatisticsPage() {
  const { user } = useAuth()
  const supabase = createClient()

  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    cancelledTasks: 0,
    completionRate: 0,
    completedDaysCount: 0,
    totalPastDaysCount: 0,
    daysCompletionRate: 0,
    streakCount: 0,
    weeklyCompletionRate: 0,
    monthlyCompletionRate: 0,
  })

  const loadStats = async () => {
    if (!user) return
    setIsLoading(true)

    try {
      const today = new Date().toISOString().split('T')[0]

      // 1. Fetch all user tasks
      const { data: allTasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)

      // 2. Fetch past schedule days for user
      const { data: pastDays } = await supabase
        .from('schedule_days')
        .select('*, schedules!inner(user_id)')
        .eq('schedules.user_id', user.id)
        .lte('date', today)

      const tasks = allTasks || []
      const days = pastDays || []

      // Rules implementation:
      // Required tasks = tasks that are NOT cancelled
      const requiredTasks = tasks.filter((t) => t.status !== 'cancelled')
      const completedTasks = requiredTasks.filter((t) => t.is_completed)
      const cancelledTasks = tasks.filter((t) => t.status === 'cancelled')

      const completionRate =
        requiredTasks.length > 0
          ? Math.round((completedTasks.length / requiredTasks.length) * 100)
          : 0

      // Completed days: only days where is_completed is true
      const completedDays = days.filter((d) => d.is_completed)
      const daysCompletionRate =
        days.length > 0
          ? Math.round((completedDays.length / days.length) * 100)
          : 0

      // Weekly calculation (last 7 days)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      const sevenDaysStr = sevenDaysAgo.toISOString().split('T')[0]

      const weeklyDays = days.filter((d) => d.date >= sevenDaysStr)
      const weeklyCompletedDays = weeklyDays.filter((d) => d.is_completed)
      const weeklyRate =
        weeklyDays.length > 0
          ? Math.round((weeklyCompletedDays.length / weeklyDays.length) * 100)
          : 0

      // Monthly calculation (last 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const thirtyDaysStr = thirtyDaysAgo.toISOString().split('T')[0]

      const monthlyDays = days.filter((d) => d.date >= thirtyDaysStr)
      const monthlyCompletedDays = monthlyDays.filter((d) => d.is_completed)
      const monthlyRate =
        monthlyDays.length > 0
          ? Math.round((monthlyCompletedDays.length / monthlyDays.length) * 100)
          : 0

      // Calculate streak: consecutive completed days ending yesterday or today
      let currentStreak = 0
      const sortedDays = [...days].sort((a, b) => b.date.localeCompare(a.date))
      for (const d of sortedDays) {
        if (d.is_completed) {
          currentStreak++
        } else if (d.date !== today) {
          // If not today and not completed, streak is broken
          break
        }
      }

      setStats({
        totalTasks: requiredTasks.length,
        completedTasks: completedTasks.length,
        cancelledTasks: cancelledTasks.length,
        completionRate,
        completedDaysCount: completedDays.length,
        totalPastDaysCount: days.length,
        daysCompletionRate,
        streakCount: currentStreak,
        weeklyCompletionRate: weeklyRate,
        monthlyCompletionRate: monthlyRate,
      })
    } catch (err) {
      console.error('Error computing statistics:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [user])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-600" />
          <span>إحصائيات الأداء ومؤشرات الإنجاز</span>
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          نظام قياس دقيق وموثوق يعكس إنجازك الفعلي دون احتساب الأيام المستقبلية
        </p>
      </div>

      {/* Main KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Streak */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 font-medium">سلسلة الالتزام الحالية</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-gray-900 dark:text-white">
            {stats.streakCount} <span className="text-sm font-semibold text-gray-400">أيام</span>
          </h3>
          <p className="text-[11px] text-gray-400 mt-2">
            استمر في إنجاز مهامك اليومية للحفاظ على هذا التوهج!
          </p>
        </Card>

        {/* Overall Completion Rate */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 font-medium">نسبة إنجاز المهام الكلية</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-gray-900 dark:text-white">
            {stats.completionRate}%
          </h3>
          <div className="mt-3">
            <ProgressBar value={stats.completionRate} size="sm" />
          </div>
        </Card>

        {/* Weekly Completion */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 font-medium">إنجاز الأسبوع الأخير</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-gray-900 dark:text-white">
            {stats.weeklyCompletionRate}%
          </h3>
          <p className="text-[11px] text-gray-400 mt-2">
            بناءً على الأيام السبعة الماضية فقط
          </p>
        </Card>

        {/* Monthly Completion */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 font-medium">إنجاز الشهر الحالي</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-gray-900 dark:text-white">
            {stats.monthlyCompletionRate}%
          </h3>
          <p className="text-[11px] text-gray-400 mt-2">
            معدل إتمام أيام الشهر المنقضية
          </p>
        </Card>
      </div>

      {/* Rules & Transparency Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Days Completion Details */}
        <Card className="p-6">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
            تفاصيل الأيام المكتملة
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
              <span className="text-sm text-gray-600 dark:text-gray-400">إجمالي الأيام المنقضية</span>
              <span className="font-bold text-gray-900 dark:text-white">{stats.totalPastDaysCount}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
              <span className="text-sm text-gray-600 dark:text-gray-400">الأيام المكتملة بنجاح 100%</span>
              <span className="font-bold text-emerald-600">{stats.completedDaysCount}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
              <span className="text-sm text-gray-600 dark:text-gray-400">نسبة نجاح الأيام</span>
              <span className="font-bold text-indigo-600">{stats.daysCompletionRate}%</span>
            </div>
          </div>
        </Card>

        {/* Tasks Breakdown */}
        <Card className="p-6">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
            توزيع المهام وحالاتها
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
              <span className="text-sm text-gray-600 dark:text-gray-400">إجمالي المهام المطلوبة</span>
              <span className="font-bold text-gray-900 dark:text-white">{stats.totalTasks}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
              <span className="text-sm text-gray-600 dark:text-gray-400">المهام المنجزة</span>
              <span className="font-bold text-emerald-600">{stats.completedTasks}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
              <span className="text-sm text-gray-600 dark:text-gray-400">المهام الملغاة (غير محتسبة)</span>
              <span className="font-bold text-red-500">{stats.cancelledTasks}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Logic rules note */}
      <Card className="p-6 bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/30">
        <h4 className="text-sm font-bold text-indigo-950 dark:text-indigo-300 flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-4 h-4 text-indigo-600" />
          <span>قواعد احتساب الإنجاز في فكرتو</span>
        </h4>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1.5 list-disc list-inside leading-relaxed">
          <li>لا يُحتسب اليوم مكتملًا إلا بعد إتمام جميع المهام المطلوبة لذلك اليوم بنسبة 100%.</li>
          <li>الأيام المستقبلية لا تُحسب كأيام فاشلة مطلقًا.</li>
          <li>المهام الملغاة تُستبعد تلقائيًا من الحساب ولا تؤثر سلبًا على معدلك.</li>
          <li>عند إضافة مهمة جديدة لأي يوم، يُعاد تقييم حالته ونسبته فورًا ودون تأخير.</li>
        </ul>
      </Card>
    </div>
  )
}
