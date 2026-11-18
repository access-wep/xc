'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, Badge, Button } from '@/components/ui'
import {
  BarChart3,
  Users,
  CheckCircle2,
  Sparkles,
  Layers,
  TrendingUp,
  Activity,
  Calendar,
  Flame,
  ArrowUpRight,
} from 'lucide-react'

export default function AdminAnalyticsPage() {
  const supabase = createClient()
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalHabits: 0,
    totalCompletions: 0,
    totalTemplates: 0,
    activeSubscriptions: 0,
  })
  const [recentHabits, setRecentHabits] = useState<any[]>([])
  const [popularTemplates, setPopularTemplates] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadPlatformStats = async () => {
    setIsLoading(true)
    try {
      // Safe Aggregations (Head: true queries)
      const [
        usersRes,
        activeUsersRes,
        habitsRes,
        logsRes,
        tplRes,
        subsRes,
        recentHabitsRes,
        templatesListRes,
      ] = await Promise.allSettled([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('habits').select('*', { count: 'exact', head: true }),
        supabase.from('habit_logs').select('*', { count: 'exact', head: true }).eq('is_completed', true),
        supabase.from('habit_templates').select('*', { count: 'exact', head: true }),
        supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('habits').select('id, name, color, icon, created_at, category').order('created_at', { ascending: false }).limit(6),
        supabase.from('habit_templates').select('*').order('created_at', { ascending: false }).limit(5),
      ])

      setStats({
        totalUsers: usersRes.status === 'fulfilled' ? usersRes.value.count || 0 : 0,
        activeUsers: activeUsersRes.status === 'fulfilled' ? activeUsersRes.value.count || 0 : 0,
        totalHabits: habitsRes.status === 'fulfilled' ? habitsRes.value.count || 0 : 0,
        totalCompletions: logsRes.status === 'fulfilled' ? logsRes.value.count || 0 : 0,
        totalTemplates: tplRes.status === 'fulfilled' ? tplRes.value.count || 0 : 0,
        activeSubscriptions: subsRes.status === 'fulfilled' ? subsRes.value.count || 0 : 0,
      })

      if (recentHabitsRes.status === 'fulfilled' && recentHabitsRes.value.data) {
        setRecentHabits(recentHabitsRes.value.data)
      }

      if (templatesListRes.status === 'fulfilled' && templatesListRes.value.data) {
        setPopularTemplates(templatesListRes.value.data)
      }
    } catch (err) {
      console.error('Failed to load admin analytics:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadPlatformStats()
  }, [])

  return (
    <div className="space-y-6 font-cairo text-right">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2.5">
          <BarChart3 className="w-6 h-6 text-purple-500" />
          <span>إحصائيات المنصة الكلية والعادات الشهرية (لوحة الإدارة)</span>
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          رؤية تحليلية شاملة للنشاط الإجمالي على مستوى قاعدة البيانات مع حماية خصوصية المستخدمين.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm text-right space-y-1">
          <div className="flex items-center justify-between">
            <Users className="w-4 h-4 text-cyan-500" />
            <span className="text-[11px] text-gray-400 font-bold">إجمالي المستخدمين</span>
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white font-mono">
            {stats.totalUsers}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-emerald-500/30 shadow-sm text-right space-y-1">
          <div className="flex items-center justify-between">
            <Activity className="w-4 h-4 text-emerald-500" />
            <span className="text-[11px] text-emerald-600 font-bold">المستخدمون النشطون</span>
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {stats.activeUsers}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-purple-500/30 shadow-sm text-right space-y-1">
          <div className="flex items-center justify-between">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-[11px] text-purple-600 font-bold">العادات المنشأة</span>
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">
            {stats.totalHabits}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-amber-500/30 shadow-sm text-right space-y-1">
          <div className="flex items-center justify-between">
            <CheckCircle2 className="w-4 h-4 text-amber-500" />
            <span className="text-[11px] text-amber-600 font-bold">إجمالي الإنجازات</span>
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
            {stats.totalCompletions}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-indigo-500/30 shadow-sm text-right space-y-1">
          <div className="flex items-center justify-between">
            <Layers className="w-4 h-4 text-indigo-500" />
            <span className="text-[11px] text-indigo-600 font-bold">قوالب العادات</span>
          </div>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
            {stats.totalTemplates}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-cyan-500/30 shadow-sm text-right space-y-1">
          <div className="flex items-center justify-between">
            <Flame className="w-4 h-4 text-cyan-500" />
            <span className="text-[11px] text-cyan-600 font-bold">اشتراكات مفعلة</span>
          </div>
          <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400 font-mono">
            {stats.activeSubscriptions}
          </div>
        </div>
      </div>

      {/* Two Columns: Popular Templates & Recently Created Habits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Popular Templates */}
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-3">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center justify-between">
            <Badge variant="cyan" size="sm">مكتبة القوالب</Badge>
            <span>أبرز قوالب العادات المعتمدة</span>
          </h3>

          <div className="space-y-2">
            {popularTemplates.map((tpl) => (
              <div
                key={tpl.id}
                className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs"
              >
                <span className="text-gray-400 font-mono">
                  {(tpl.habits_data as any[])?.length || 0} عادات
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800 dark:text-gray-200">
                    {tpl.title}
                  </span>
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: tpl.color || '#10b981' }}
                  >
                    ✓
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Created Habits Across the Platform */}
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-3">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center justify-between">
            <Badge variant="success" size="sm">تحديث مباشر</Badge>
            <span>أحدث العادات المسجلة بالمنصة</span>
          </h3>

          <div className="space-y-2">
            {recentHabits.map((habit) => (
              <div
                key={habit.id}
                className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs"
              >
                <span className="text-[11px] text-gray-400">
                  {new Date(habit.created_at).toLocaleDateString('ar-SA')}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800 dark:text-gray-200">
                    {habit.name}
                  </span>
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: habit.color || '#22d3ee' }}
                  >
                    ★
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
